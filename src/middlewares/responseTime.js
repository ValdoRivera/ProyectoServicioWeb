// src/middlewares/responseTime.js
const logger = require("../config/logger");

module.exports = (req, res, next) => {
  const start = Date.now();

  // Cuando la respuesta termine, calculamos el tiempo
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = req.log || logger;

    log.info(
      `Response time ➜ ${duration}ms | ${req.method} ${req.originalUrl}`
    );
  });

  next();
};