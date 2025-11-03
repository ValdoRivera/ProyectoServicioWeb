// src/routes/api/rates.js
const { Router } = require("express");
const ctrl = require("../../controllers/ratesController");
const router = Router();

router.get("/", ctrl.getRates);                 // GET /api/rates?base=USD
router.get("/convert", ctrl.convert);           // GET /api/rates/convert?amount=100&from=USD&to=BTC

module.exports = router;
