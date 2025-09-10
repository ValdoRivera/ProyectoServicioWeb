require("dotenv").config(); // cargar variables de entorno primero
const express = require("express");
const { sequelize } = require("./src/models/databases"); // ✅ corregido
const routes = require("./src/routes/api");              // ✅ corregido

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Middleware
app.use(express.json());

// 🔹 Función asíncrona para iniciar DB + servidor
async function startServer() {
  try {
    // Conexión y autenticación con la base de datos
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Sincronización de modelos con la base de datos
    await sequelize.sync(); // puedes usar { alter: true } en desarrollo
    console.log("✅ DB is ready");

    // Rutas
    app.use("/api", routes);

    // Levantar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Error al iniciar la app:", err);
  }
}

// 🔹 Ejecutar
startServer();
