require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { randomUUID } = require("crypto");

const logger = require("./config/logger"); // ⬅️ nuevo
const sequelize = require("./config/db");
require("./models/Conversion");
require("./models/Usuario");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

/* ----------------- Middlewares base ----------------- */
app.use(cors());
app.use(helmet());
app.use(express.json());

/* --------- Request-ID (para correlación simple) ------- */
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || randomUUID();
  res.setHeader("x-request-id", req.id);
  // logger por request con el rid
  req.log = logger.child({ rid: req.id });
  next();
});

/* ------------------- Morgan -> Winston ---------------------- */
morgan.token("rid", (req) => req.id);
app.use(
  morgan(':date[iso] :method :url :status :response-time ms rid=:rid', {
    stream: {
      write: (message) => logger.info(message.trim()), // puedes usar logger.http si defines ese nivel
    },
  })
);

/* --------------------- Rutas -------------------------- */
app.use("/api", routes);

/* ------------------ 404 Not Found --------------------- */
app.use((req, res) => {
  // usa el logger del request para incluir rid automáticamente
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
    });
  } catch (err) {
    logger.error(`❌ Error al iniciar: ${err.message}`);
    process.exit(1);
  }
})();
