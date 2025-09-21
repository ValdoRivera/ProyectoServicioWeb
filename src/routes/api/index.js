// src/routes/api/index.js
const { Router } = require("express");
const router = Router();

// públicas opcionales (healthcheck)
router.get("/", (_req, res) => res.json({ ok: true, api: "divisas-cripto" }));

// RUTAS DE RATES (NUEVAS)
const ratesRoutes = require("./rates");
router.use("/rates", ratesRoutes);

// Si usas usuarios, auth, etc., los agregas aquí:
// const usuariosRoutes = require("./usuarios");
// router.use("/usuarios", usuariosRoutes);

module.exports = router;

