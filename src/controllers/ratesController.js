// src/controllers/ratesController.js
const {
  getRates,
  convertAndRecord,
  getWorldCupSymbols,
  convertWithBonuses,
} = require("../services/ratesService");

exports.getRates = async (req, res) => {
  const base = (req.query.base || "").toUpperCase();
  const rates = await getRates(base || undefined);
  res.json({
    base: base || process.env.FIAT_DEFAULT_BASE || "USD",
    rates,
  });
};

exports.convert = async (req, res) => {
  const { amount, from, to, isMatchDay, promoCode, rank } = req.query;

  if (!from || !to || !amount || isNaN(amount)) {
    return res.status(400).json({
      message: "Parámetros requeridos: amount, from, to",
    });
  }

  const data = await convertWithBonuses({
    amount: Number(amount),
    from,
    to,
    isMatchDay: String(isMatchDay || "").toLowerCase() === "true",
    promoCode,
    rank: rank != null ? Number(rank) : undefined,
  });

  await convertAndRecord(amount, from, to);
  res.json(data);
};

exports.symbols = async (_req, res) => {
  const data = getWorldCupSymbols();
  res.json({ count: data.length, data });
};
