// src/routes/api/index.js
const { Router } = require("express");
const router = Router();

// 1) Públicas opcionales (healthcheck)
router.get("/", (_req, res) => res.json({ ok: true, api: "divisas-cripto" }));

// 2) Rutas de rates
const ratesRoutes = require("./rates");
router.use("/rates", ratesRoutes);

// 4) Rutas de usuarios (nuevo punto)
const usersRoutes = require("./users");
router.use("/users", usersRoutes);

module.exports = router;


