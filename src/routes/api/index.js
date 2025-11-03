// src/routes/api/index.js
const { Router } = require("express");
const router = Router();

router.get("/", (_req, res) => res.json({ ok: true, api: "divisas-cripto" }));

const authRoutes  = require("./auth.route");
const ratesRoutes = require("./rates");
const usersRoutes = require("./users");

router.use("/auth",  authRoutes);
router.use("/rates", ratesRoutes);
router.use("/users", usersRoutes);

module.exports = router;

