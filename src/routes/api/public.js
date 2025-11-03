const express = require('express');
const router = express.Router();
require('dotenv').config();

// Si tienes un archivo auth.js en ESTA MISMA carpeta, usa:
const authrouter = require('./auth');

// Ruta simple de prueba
router.get('/ping', (req, res) => res.json({ ok: true }));

// Si luego montas auth:
router.use('/auth', authrouter);

module.exports = router;
