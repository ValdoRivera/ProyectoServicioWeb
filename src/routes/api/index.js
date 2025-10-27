const { Router } = require("express");
const router = Router();

// Healthcheck
router.get("/", (_req, res) => res.json({ ok: true, api: "divisas-cripto" }));

// Rates
router.use("/rates", require("./rates"));

// Auth
router.use("/auth", require("./auth.route"));

// Users (público: datos mínimos por ID)
router.use("/users", require("./users"));

// User (privado: datos completos por ID)  ⬅️ IMPORTANTE
router.use("/user", require("./user"));

module.exports = router;
