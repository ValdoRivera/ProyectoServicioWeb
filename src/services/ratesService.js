// src/services/ratesService.js
const axios = require("axios");
const Conversion = require("../models/Conversion");
const { buildQualifiedSetES } = require("../config/worldcup");
const { getTeamRank } = require("./rankService");

const FIAT_API_BASE = process.env.FIAT_API_BASE || "https://api.exchangerate.host";
const CRYPTO_API_BASE = process.env.CRYPTO_API_BASE || "https://api.coingecko.com/api/v3";
const DEFAULT_BASE = (process.env.FIAT_DEFAULT_BASE || "USD").toUpperCase();
const USE_MOCK = String(process.env.USE_MOCK_RATES || "false").toLowerCase() === "true";
const CACHE_TTL = Number(process.env.RATES_CACHE_TTL || 60);

let cache = { ts: 0, base: null, rates: null };
const fresh = (ts) => Date.now() - ts < CACHE_TTL * 1000;

/* Providers */
async function getFiatRates(base) {
  const url1 = `${FIAT_API_BASE}/latest?base=${encodeURIComponent(base)}`;
  const { data: data1 } = await axios.get(url1, { timeout: 6000 });
  if (data1?.rates && Object.keys(data1.rates).length) return data1.rates;

  const url2 = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`;
  const { data: data2 } = await axios.get(url2, { timeout: 6000 });
  if (data2?.rates && Object.keys(data2.rates).length) return data2.rates;

  throw new Error("Fiat provider sin datos");
}

async function getCryptoRatesInBase(base, symbols = ["BTC", "ETH"]) {
  const idMap = { BTC: "bitcoin", ETH: "ethereum" };
  const ids = symbols.map((s) => idMap[s]).filter(Boolean).join(",");
  const vs = base.toLowerCase();
  const { data } = await axios.get(
    `${CRYPTO_API_BASE}/simple/price?ids=${ids}&vs_currencies=${vs}`,
    { timeout: 6000 }
  );

  const out = {};
  if (data.bitcoin?.[vs] != null) out.BTC = 1 / data.bitcoin[vs];
  if (data.ethereum?.[vs] != null) out.ETH = 1 / data.ethereum[vs];
  return out;
}

/* Mock rates */
function mockRates(base) {
  const fiat = {
    USD: 1, EUR: 0.92, MXN: 17, ARS: 950, BRL: 5.2, GBP: 0.78,
    JPY: 157, COP: 4050, CLP: 920, PEN: 3.75, CAD: 1.36,
    AUD: 1.52, CNY: 7.2, KRW: 1380,
  };
  const crypto = { BTC: 0.000015, ETH: 0.0003 };

  if (base !== "USD") {
    const factor = fiat[base] ? 1 / fiat[base] : 1;
    Object.keys(fiat).forEach((k) => (fiat[k] = fiat[k] * factor));
    Object.keys(crypto).forEach((k) => (crypto[k] = crypto[k] * factor));
    fiat[base] = 1;
  }

  return { ...fiat, ...crypto };
}

/* Mundial: símbolos */
const WORLD_CUP_TEAMS = [
  { team: "Argentina", code: "ARG", currency: "ARS" },
  { team: "Brasil", code: "BRA", currency: "BRL" },
  { team: "España", code: "ESP", currency: "EUR" },
  { team: "México", code: "MEX", currency: "MXN" },
  { team: "Estados Unidos", code: "USA", currency: "USD" },
  { team: "Inglaterra", code: "ENG", currency: "GBP" },
  { team: "Japón", code: "JPN", currency: "JPY" },
  { team: "Canadá", code: "CAN", currency: "CAD" },
  { team: "Australia", code: "AUS", currency: "AUD" },
  { team: "Corea del Sur", code: "KOR", currency: "KRW" },
  { team: "Chile", code: "CHI", currency: "CLP" },
  { team: "Colombia", code: "COL", currency: "COP" },
  { team: "Perú", code: "PER", currency: "PEN" },
];

function normalizeKey(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function getWorldCupSymbols() {
  const qset = buildQualifiedSetES();
  return WORLD_CUP_TEAMS.map((t) => ({
    ...t,
    qualified: qset.has(normalizeKey(t.team)),
  }));
}

/* MAIN */
async function getRates(base = DEFAULT_BASE) {
  base = base.toUpperCase();
  if (cache.rates && cache.base === base && fresh(cache.ts)) return cache.rates;

  if (USE_MOCK) {
    const rates = mockRates(base);
    cache = { ts: Date.now(), base, rates };
    return rates;
  }

  const [fiatRates, cryptoRates] = await Promise.all([
    getFiatRates(base),
    getCryptoRatesInBase(base, ["BTC", "ETH"]),
  ]);

  const rates = { ...fiatRates, ...cryptoRates, [base]: 1 };
  cache = { ts: Date.now(), base, rates };
  return rates;
}

/* Conversión simple */
async function convert(amount, from, to) {
  from = String(from).toUpperCase();
  to = String(to).toUpperCase();

  if (from === to)
    return { amount, from, to, result: amount, base: DEFAULT_BASE, usedRates: {} };

  const base = DEFAULT_BASE;
  const rates = await getRates(base);
  const rateFrom = rates[from];
  const rateTo = rates[to];

  if (!rateFrom) throw new Error(`No hay tasa para ${from}`);
  if (!rateTo) throw new Error(`No hay tasa para ${to}`);

  const enBase = from === base ? amount : amount / rateFrom;
  const result = enBase * rateTo;

  return { amount, from, to, result, base, usedRates: { [from]: rateFrom, [to]: rateTo } };
}

/* Persistencia */
function normalizeSymbol(sym) {
  return String(sym || "").trim().toUpperCase();
}

async function convertAndRecord(amount, from, to) {
  const amt = Number(amount);
  const fromSym = normalizeSymbol(from);
  const toSym = normalizeSymbol(to);
  const data = await convert(amt, fromSym, toSym);

  await Conversion.create({
    fromSymbol: data.from,
    toSymbol: data.to,
    amount: data.amount,
    result: data.result,
    base: data.base,
    meta: data.usedRates,
  });

  return data;
}

/* Bono por ranking */
function calculateTeamRankingBonus(rank) {
  if (typeof rank !== "number" || rank <= 0) {
    const err = new Error("Ranking inválido");
    err.code = "BAD_RANK";
    throw err;
  }
  let bonusPct = 0;
  if (rank <= 5) bonusPct = 0.05;
  else if (rank <= 10) bonusPct = 0.03;
  return {
    bonusPct,
    description: bonusPct ? (rank <= 5 ? "Equipo Top 5" : "Equipo Top 10") : "Sin bono",
  };
}

/* Conversión con bonos y promos */
async function convertWithBonuses(params) {
  const { amount, from, to, isMatchDay = false, promoCode, rank, teamName } = params || {};
  const core = await convert(Number(amount), from, to);

  let feePct = isMatchDay ? 0.01 : 0.02;

  let usedRank = rank != null ? Number(rank) : null;
  if (usedRank == null && teamName) {
    const autoRank = await getTeamRank(teamName);
    if (autoRank != null) usedRank = Number(autoRank);
  }

  if (usedRank != null) {
    const { bonusPct } = calculateTeamRankingBonus(usedRank);
    feePct = Math.max(feePct - feePct * bonusPct, 0);
  }

  if (promoCode && String(promoCode).toUpperCase() === "GOAL10") {
    feePct = Math.max(feePct - feePct * 0.1, 0);
  }

  const gross = core.result;
  const feeAmount = gross * feePct;
  const net = gross - feeAmount;

  return {
    ...core,
    gross: Number(gross.toFixed(6)),
    feePct,
    feeAmount: Number(feeAmount.toFixed(6)),
    net: Number(net.toFixed(6)),
    effectiveRate: Number((net / Number(amount)).toFixed(6)),
    meta: {
      ...(core.usedRates || {}),
      isMatchDay: !!isMatchDay,
      promoCode: promoCode || null,
      rank: usedRank ?? null,
      teamName: teamName || null,
    },
  };
}

module.exports = {
  getRates,
  convert,
  convertAndRecord,
  getWorldCupSymbols,
  calculateTeamRankingBonus,
  convertWithBonuses,
};
