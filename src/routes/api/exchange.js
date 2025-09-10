// src/routes/api/exchange.js
const { Router } = require('express');
const ctrl = require('../../controllers/exchange.controller');

const router = Router();

// Endpoints de divisas
router.get('/rates', ctrl.listRates);                  // GET  /api/exchange/rates?base=USD&quote=MXN
router.get('/rates/:base/:quote', ctrl.getLatestRate); // GET  /api/exchange/rates/USD/MXN
router.post('/rates', ctrl.upsertRate);                // POST /api/exchange/rates
router.post('/convert', ctrl.convert);                 // POST /api/exchange/convert

module.exports = router;
