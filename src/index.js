require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { randomUUID } = require("crypto");

// Instancia de Sequelize
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
  next();
});

/* ------------------- Morgan logs ---------------------- */
morgan.token("rid", (req) => req.id);
app.use(morgan(':date[iso] :method :url :status :response-time ms rid=:rid'));

/* --------------------- Rutas -------------------------- */
app.use("/api", routes);

/* ------------------ 404 Not Found --------------------- */
app.use((req, res) => {
  console.warn(`[WARN] 404 ${req.method} ${req.originalUrl} rid=${req.id}`);
  res.status(404).json({ message: "Ruta no encontrada" });
});

/* ----------------- Manejo de errores ------------------ */
app.use((err, req, res, _next) => {
  console.error(
    `[ERROR] rid=${req.id} ${err.message}\n${err.stack || "(sin stack)"}`
  );
  res.status(err.status || 500).json({ message: err.message || "Error interno" });
});

/* -------------------- Arranque ------------------------ */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada");

    // IMPORTANTE: sin alter para no seguir acumulando índices
    await sequelize.sync();
    console.log("✅ DB lista y sincronizada");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar:", err);
    process.exit(1);
  }
})();
