process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION ➜", err.stack || err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION ➜", err?.stack || err);
  process.exit(1);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { randomUUID } = require("crypto");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const logger = require("./config/logger");
const sequelize = require("./config/db");
require("./models/Conversion");
require("./models/Usuario");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

/* ----------------- Middlewares base ----------------- */
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

/* --------- Request-ID para trazabilidad --------- */
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || randomUUID();
  res.setHeader("x-request-id", req.id);
  req.log = logger.child({ rid: req.id });
  next();
});

/* ------------------- Morgan + Winston ---------------------- */
morgan.token("rid", (req) => req.id);
app.use(
  morgan(':date[iso] :method :url :status :response-time ms rid=:rid', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

/* --------------------- Swagger -------------------------- */
const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Casa de Cambio Mundial API",
      version: "1.0.0",
      description:
        "API de tipos de cambio con temática del mundial. Incluye conversión con promos, bono por ranking y símbolos clasificados 2026.",
    },
    servers: [
      { url: "/api", description: "Ruta base (montado en /api)" },
      { url: `http://localhost:${PORT}/api`, description: "Local Dev" },
    ],
  },
  apis: ["./src/routes/api/*.js"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/* --------------------- Rutas -------------------------- */
app.use("/api", routes);

/* ------------------ 404 Not Found --------------------- */
app.use((req, res) => {
  (req.log || logger).warn(`404 ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Ruta no encontrada" });
});

/* ----------------- Manejo de errores ------------------ */
app.use((err, req, res, _next) => {
  (req.log || logger).error(`${err.message}\n${err.stack || "(sin stack)"}`);
  res.status(err.status || 500).json({ message: err.message || "Error interno" });
});

/* -------------------- Arranque ------------------------ */
(async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ DB conectada");

    await sequelize.sync();
    logger.info("✅ DB lista y sincronizada");

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      logger.info(`📘 Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    logger.error(`❌ Error al iniciar: ${err.message}`);
    process.exit(1);
  }
})();
