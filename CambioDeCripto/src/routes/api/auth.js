const express = require('express');
const authControllers = require('../../controllers/authControllers');
const router = express.Router();
require('dotenv').config();

router.post('/register', authControllers.register);

router.get('/test', async (req, res) => {
  try {
    const users = [
      { name: 'Oswaldo', cellphone: '3317993894', email: 'valdo@example.com' },
    ];
    if (users.length === 0) {
      return res.status(404).json({ error: 'No se encontraron usuarios' });
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error en /api/test:', err);
    return res.status(500).json({ error: 'Error interno en /api/test' });
  }
});

module.exports = router;
