require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const routes = require('./routes'); // usa routes/index.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Monta todas tus rutas bajo /api
app.use('/api', routes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    await sequelize.sync(); // crea tablas si no existen
    console.log('DB lista');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar:', err);
    process.exit(1);
  }
})();
