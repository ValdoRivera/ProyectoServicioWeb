require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

console.log("BOOT 1: dotenv loaded");

const express = require("express");
const app = express();

app.use(express.json());
console.log("BOOT 2: express.json mounted");

// ⚠️ Si tu logger o httpLogger puede fallar, comenta temporalmente para probar
// const logger = require("./config/logger");
// const httpLogger = require("./middleware/httpLogger");
// app.use(httpLogger);

let routes;
try {
  routes = require("./routes");   // <- si falla aquí, lo sabremos
  console.log("BOOT 3: routes module required OK");
} catch (e) {
  console.error("ERROR requiring ./routes:", e);
  process.exit(1);
}

app.use("/api", routes);
console.log("BOOT 4: /api mounted");

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

try {
  const PORT = process.env.PORT || 3000;

  // Opcional: lista las rutas reales registradas
  try {
    const listEndpoints = require("express-list-endpoints");
    console.log("ROUTES:", listEndpoints(app));
  } catch(_) {}

  const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));


  app.listen(PORT, () => {
    console.log(`BOOT 5: listening on http://localhost:${PORT}`);
  });
} catch (e) {
  console.error("ERROR in app.listen:", e);
  process.exit(1);
}
