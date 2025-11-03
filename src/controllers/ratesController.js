// src/controllers/ratesController.js
const { getRates, convert } = require("../services/ratesService");
const Conversion = require("../models/Conversion");

exports.getRates = async (req, res, next) => {
  try {
    const base = (req.query.base || "").toUpperCase();
    const rates = await getRates(base || undefined);
    res.json({ base: base || process.env.FIAT_DEFAULT_BASE || "USD", rates });
  } catch (err) { next(err); }
};

exports.convert = async (req, res, next) => {
  try {
    const { amount, from, to } = req.query;
    const amt = Number(amount);
    if (!from || !to || !amount || isNaN(amt)) {
      return res.status(400).json({ message: "Parámetros requeridos: amount, from, to" });
    }
    const data = await convert(amt, from, to);
    await Conversion.create({
      fromSymbol: data.from,
      toSymbol: data.to,
      amount: data.amount,
      result: data.result,
      base: data.base,
      meta: data.usedRates,
    });
    res.json(data);
  } catch (err) { next(err); }
};
