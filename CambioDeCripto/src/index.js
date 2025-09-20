const express = require('express');
require('dotenv').config();

const sequelize = require('./config/db');
const routes = require('./routes');

// Si necesitas el modelo Recorrido en este archivo:
const Recorrido = require('./models/usermodels.js'); // 👈 antes apuntaba a userModels.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// monta rutas
app.use(routes.unprotectedroutes);
app.use('/api', routes.usuariosRoutes);

async function startServer() {
  try {
    await sequelize.sync();
    console.log('DB is ready');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al sincronizar la base de datos:', err);
    process.exit(1);
  }
}

startServer();
