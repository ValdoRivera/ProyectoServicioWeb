const { Router } = require("express");
const router = Router();

// 1) Públicas opcionales (healthcheck)
router.get("/", (_req, res) => res.json({ ok: true, api: "divisas-cripto" }));

// 2) Rutas de rates
const ratesRoutes = require("./rates");
router.use("/rates", ratesRoutes);

// 3) Rutas de autenticación
const authRoutes = require("./auth.route");
router.use("/auth", authRoutes);

// 4) Rutas de usuarios
const usersRoutes = require("./users");
router.use("/users", usersRoutes);

module.exports = router;


