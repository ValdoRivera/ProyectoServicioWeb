require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Instancia de Sequelize
const sequelize = require("./config/db");

// 4) Modelos que deben existir para sync
require("./models/Conversion"); 
require("./models/Usuario");   // 5) nuevo modelo Usuario

const routes = require("./routes"); // usa routes/index.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Monta todas las rutas bajo /api
app.use("/api", routes);

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware de errores
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Error interno" });
});

// Función autoejecutable para arrancar el servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada");

    // { alter: true } actualiza la tabla en dev si cambias el modelo
    await sequelize.sync({ alter: true });
    console.log("✅ DB lista y sincronizada");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar:", err);
    process.exit(1);
  }
})();
