// src/controllers/ratesController.js
const {
  getRates,
  convertAndRecord,
  getWorldCupSymbols,
} = require("../services/ratesService");

exports.getRates = async (req, res, next) => {
  try {
    const base = (req.query.base || "").toUpperCase();
    const rates = await getRates(base || undefined);
    res.json({ base: base || process.env.FIAT_DEFAULT_BASE || "USD", rates });
  } catch (err) {
    next(err);
  }
};

exports.convert = async (req, res, next) => {
  try {
    const { amount, from, to } = req.query; // si usas POST, cambia a req.body
    const amt = Number(amount);
    if (!from || !to || !amount || isNaN(amt)) {
      return res.status(400).json({ message: "Parámetros requeridos: amount, from, to" });
    }
    const data = await convertAndRecord(amt, from, to);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.symbols = async (_req, res) => {
  const data = getWorldCupSymbols();
  res.json({ count: data.length, data });
};
