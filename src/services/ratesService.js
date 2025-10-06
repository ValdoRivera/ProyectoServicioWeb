// src/services/ratesService.js
const axios = require("axios");

const FIAT_API_BASE = process.env.FIAT_API_BASE || "https://api.exchangerate.host";
const CRYPTO_API_BASE = process.env.CRYPTO_API_BASE || "https://api.coingecko.com/api/v3";
const DEFAULT_BASE = (process.env.FIAT_DEFAULT_BASE || "USD").toUpperCase();
const USE_MOCK = String(process.env.USE_MOCK_RATES || "false").toLowerCase() === "true";
const CACHE_TTL = Number(process.env.RATES_CACHE_TTL || 60);

let cache = { ts: 0, base: null, rates: null };
const fresh = (ts) => Date.now() - ts < CACHE_TTL * 1000;

async function getFiatRates(base) {
  // 1) exchangerate.host
  try {
    const url1 = `${FIAT_API_BASE}/latest?base=${encodeURIComponent(base)}`;
    const { data } = await axios.get(url1, { timeout: 6000 });
    if (data && data.rates && Object.keys(data.rates).length) {
      return data.rates;
    }
  } catch (_) {

  }

  try {
    const url2 = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`;
    const { data } = await axios.get(url2, { timeout: 6000 });
    if (data && data.rates && Object.keys(data.rates).length) {
      return data.rates;
    }
  } catch (_) {
  }

  throw new Error("Fiat provider sin datos");
}

async function getCryptoRatesInBase(base, symbols = ["BTC", "ETH"]) {
  const idMap = { BTC: "bitcoin", ETH: "ethereum" };
  const ids = symbols.map((s) => idMap[s]).filter(Boolean).join(",");
  const vs = base.toLowerCase();
  const { data } = await axios.get(`${CRYPTO_API_BASE}/simple/price?ids=${ids}&vs_currencies=${vs}`, { timeout: 6000 });
  const out = {};
  if (data.bitcoin && data.bitcoin[vs] != null) out.BTC = 1 / data.bitcoin[vs];
  if (data.ethereum && data.ethereum[vs] != null) out.ETH = 1 / data.ethereum[vs];
  return out;
}

// ----------------- MOCK RATES -----------------
function mockRates(base) {
  const fiat = { USD: 1, EUR: 0.92, MXN: 17, ARS: 950, PEN: 3.75 };
  const crypto = { BTC: 0.000015, ETH: 0.0003 };

  if (base !== "USD") {
    const factor = fiat[base] ? 1 / fiat[base] : 1;
    Object.keys(fiat).forEach((k) => (fiat[k] = fiat[k] * factor));
    Object.keys(crypto).forEach((k) => (crypto[k] = crypto[k] * factor));
    fiat[base] = 1;
  }
  return { ...fiat, ...crypto };
}

// ----------------- MAIN FUNCTIONS -----------------
async function getRates(base = DEFAULT_BASE) {
  base = base.toUpperCase();

  if (cache.rates && cache.base === base && fresh(cache.ts)) {
    return cache.rates;
  }

  if (USE_MOCK) {
    const rates = mockRates(base);
    cache = { ts: Date.now(), base, rates };
    return rates;
  }

  try {
    const [fiatRates, cryptoRates] = await Promise.all([
      getFiatRates(base),
      getCryptoRatesInBase(base, ["BTC", "ETH"]),
    ]);
    const rates = { ...fiatRates, ...cryptoRates, [base]: 1 };
    cache = { ts: Date.now(), base, rates };
    return rates;
  } catch (err) {
    // fallback a mock si falla todo
    const rates = mockRates(base);
    cache = { ts: Date.now(), base, rates };
    return rates;
  }
}

async function convert(amount, from, to) {
  from = from.toUpperCase();
  to = to.toUpperCase();

  if (from === to) {
    return { amount, from, to, result: amount, base: DEFAULT_BASE, usedRates: {} };
  }

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

module.exports = { getRates, convert };
