const express = require('express');
const router = express.Router();
require('dotenv').config();



// Ruta simple de prueba
router.get('/ping', (req, res) => res.json({ ok: true }));

// Si luego montas auth:
// router.use('/auth', authrouter);

module.exports = router;
