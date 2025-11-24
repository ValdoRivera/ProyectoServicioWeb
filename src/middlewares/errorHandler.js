// src/middlewares/errorHandler.js
const logger = require("../config/logger");
const { BaseError } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  // Por si alguien llama next() sin error
  if (!err) return next();

  const log = req.log || logger;
  const isProd = process.env.NODE_ENV === "production";

  // Si no es un BaseError, lo envolvemos en uno genérico 500
  let error = err instanceof BaseError
    ? err
    : new BaseError("Error interno del servidor", {
        statusCode: 500,
        isOperational: false, // esto indica que probablemente es un bug
      });

  const statusCode = error.statusCode || 500;

  // Logging: errores de servidor (5xx) como error, el resto como warn
  const logPayload = {
    message: error.message,
    code: error.code,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  };

  if (!error.isOperational || statusCode >= 500) {
    log.error("Unhandled error", { ...logPayload, stack: error.stack });
  } else {
    log.warn("Operational error", logPayload);
  }

  // Respuesta al cliente
  const responseBody = {
    message: error.message,
    code: error.code,
  };

  // Solo en no-producción mandamos detalles extras (útil para dev)
  if (!isProd) {
    responseBody.details = error.details;
    responseBody.stack = error.stack;
  }

  return res.status(statusCode).json(responseBody);
};
