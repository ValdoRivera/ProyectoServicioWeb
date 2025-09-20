const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');  // 👈 cambio aquí

// GET /api/test
router.get('/test', async (req, res) => {
  try {
    const users = await Usuario.findAll();
    if (users.length === 0) {
      return res.status(404).json({ error: 'No se encontraron usuarios' });
    }
    return res.json(users);
  } catch (err) {
    console.error('Error en /api/test:', err);
    return res.status(500).json({ error: 'Error interno en /api/test' });
  }
});

module.exports = router;
