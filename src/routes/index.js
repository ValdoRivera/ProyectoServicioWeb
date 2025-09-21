// src/routes/index.js
const { Router } = require("express");
const router = Router();

// /api/*
const apiRoutes = require("./api");
router.use("/", apiRoutes); // recuerda que en app.js lo montas en /api

module.exports = router;
