// src/controllers/ratesController.js

// Importamos del servicio las funciones que necesitamos para las operaciones
// relacionadas con tasas de cambio y conversiones.
const {
  getRates,           // Obtiene las tasas de cambio en base a una moneda
  convertAndRecord,   // Convierte y además registra la operación (para logs/estadísticas)
  getWorldCupSymbols, // Obtiene símbolos/monedas relacionados con el Mundial
  convertWithBonuses, // Convierte aplicando posibles bonos/promociones
} = require("../services/ratesService");

// Controlador para obtener las tasas de cambio
exports.getRates = async (req, res) => {
  // Tomamos el parámetro base de la query, lo convertimos a mayúsculas.
  // Si no viene, será cadena vacía.
  const base = (req.query.base || "").toUpperCase();

  // Llamamos al servicio. Si base está vacío, pasamos undefined
  // para que el servicio use su valor por defecto.
  const rates = await getRates(base || undefined);

  // Respondemos con:
  // - la base (si no hay, tomamos FIAT_DEFAULT_BASE o "USD" por defecto)
  // - el objeto de tasas de cambio
  res.json({ base: base || process.env.FIAT_DEFAULT_BASE || "USD", rates });
};

// Controlador para convertir montos entre monedas
exports.convert = async (req, res) => {
  // Obtenemos parámetros desde la query string
  const { amount, from, to, isMatchDay, promoCode, rank, teamName } = req.query;

  // Validación básica de parámetros requeridos
  if (!from || !to || !amount || isNaN(amount)) {
    return res.status(400).json({
      message: "Parámetros requeridos: amount, from, to",
    });
  }

  // Llamamos al servicio que hace la conversión aplicando posibles bonos:
  // - amount: se convierte a número
  // - from, to: monedas de origen y destino
  // - isMatchDay: convertimos el valor de la query a booleano (true/false)
  // - promoCode: código promocional opcional
  // - rank: rango/posición del usuario (si viene) convertido a número
  // - teamName: nombre del equipo (nuevo parámetro)
  const data = await convertWithBonuses({
    amount: Number(amount),
    from,
    to,
    isMatchDay: String(isMatchDay || "").toLowerCase() === "true",
    promoCode,
    rank: rank != null ? Number(rank) : undefined,
    teamName, // nuevo
  });

  // Además de convertir, registramos la operación en el sistema
  // (por ejemplo, para métricas o auditoría).
  await convertAndRecord(amount, from, to);

  // Respondemos al cliente con los datos resultantes de la conversión
  res.json(data);
};

// Controlador para obtener los símbolos relacionados con el Mundial
exports.symbols = async (_req, res) => {
  // Obtenemos la lista de símbolos desde el servicio
  const data = getWorldCupSymbols();

  // Respondemos con la cantidad total y los datos
  res.json({ count: data.length, data });
};
