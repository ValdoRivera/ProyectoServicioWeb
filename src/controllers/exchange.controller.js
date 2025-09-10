const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ExchangeRate = require('../models/ExchangeRate');
const ExchangeTransaction = require('../models/ExchangeTransaction');

/**
 * Helpers
 */
function isValidCode(code) {
  return typeof code === 'string' && code.trim().length > 0;
}

function parseAmount(n) {
  const x = Number(n);
  if (Number.isNaN(x) || !Number.isFinite(x) || x <= 0) return null;
  return x;
}

/**
 * Crea o actualiza una tasa de cambio.
 * Body: { base, quote, rate, effectiveAt? }
 */
exports.upsertRate = async (req, res) => {
  try {
    const { base, quote, rate, effectiveAt } = req.body;

    if (!isValidCode(base) || !isValidCode(quote))
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'base y quote son obligatorios' });

    const r = Number(rate);
    if (!r || r <= 0)
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'rate debe ser > 0' });

    const eff = effectiveAt ? new Date(effectiveAt) : new Date();

    const created = await ExchangeRate.create({ base: base.toUpperCase(), quote: quote.toUpperCase(), rate: r, effectiveAt: eff });

    return res.json({
      message: 'Tasa registrada',
      rate: created
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'No se pudo registrar la tasa' });
  }
};

/**
 * Lista tasas (opcionalmente filtra por par)
 * Query: ?base=USD&quote=MXN&limit=20
 */
exports.listRates = async (req, res) => {
  try {
    const { base, quote, limit = 50 } = req.query;
    const where = {};
    if (base) where.base = base.toUpperCase();
    if (quote) where.quote = quote.toUpperCase();

    const rows = await ExchangeRate.findAll({
      where,
      order: [['effectiveAt', 'DESC']],
      limit: Math.min(Number(limit) || 50, 200)
    });

    return res.json({ rates: rows });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'No se pudo listar tasas' });
  }
};

/**
 * Convierte un monto. Si no hay tasa directa, intenta con la inversa (1/r).
 * Body: { from, to, amount }
 */
exports.convert = async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    if (!isValidCode(from) || !isValidCode(to))
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'from y to son obligatorios' });

    const amt = parseAmount(amount);
    if (!amt) return res.status(httpStatus.BAD_REQUEST).json({ error: 'amount inválido' });

    const FROM = from.toUpperCase();
    const TO = to.toUpperCase();

    // 1) Intentar tasa directa más reciente
    let rateRow = await ExchangeRate.findOne({
      where: { base: FROM, quote: TO },
      order: [['effectiveAt', 'DESC']]
    });

    let usedRate = null;
    let direction = 'directa';

    // 2) Si no existe, intentar inversa y usar 1/r
    if (!rateRow) {
      const inverse = await ExchangeRate.findOne({
        where: { base: TO, quote: FROM },
        order: [['effectiveAt', 'DESC']]
      });
      if (inverse) {
        usedRate = 1 / Number(inverse.rate);
        direction = 'inversa';
      }
    } else {
      usedRate = Number(rateRow.rate);
    }

    if (!usedRate)
      return res.status(httpStatus.NOT_FOUND).json({ error: `No hay tasa disponible para ${FROM}/${TO}` });

    const result = amt * usedRate;

    // Registrar transacción (opcional)
    const tx = await ExchangeTransaction.create({
      fromCurrency: FROM,
      toCurrency: TO,
      amount: amt,
      rateUsed: usedRate,
      resultAmount: result
    });

    return res.json({
      message: 'Conversión realizada',
      pair: `${FROM}/${TO}`,
      rateSource: direction,
      rate: usedRate,
      amount: amt,
      result,
      transactionId: tx.id
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'No se pudo convertir' });
  }
};

/**
 * Obtiene la última tasa para un par específico
 * Params: /rates/:base/:quote
 */
exports.getLatestRate = async (req, res) => {
  try {
    const base = req.params.base?.toUpperCase();
    const quote = req.params.quote?.toUpperCase();
    if (!isValidCode(base) || !isValidCode(quote))
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'par inválido' });

    const row = await ExchangeRate.findOne({
      where: { base, quote },
      order: [['effectiveAt', 'DESC']]
    });

    if (!row) return res.status(404).json({ error: 'Tasa no encontrada' });
    return res.json({ rate: row });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'No se pudo obtener la tasa' });
  }
};
