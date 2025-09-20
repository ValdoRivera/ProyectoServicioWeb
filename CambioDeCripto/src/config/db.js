require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  // si DB_PASSWORD está vacío, no se envía password (evita "using password: YES")
  password: process.env.DB_PASSWORD && process.env.DB_PASSWORD.length ? process.env.DB_PASSWORD : undefined,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch((err) => console.error('Error trying to connect:', err));

module.exports = sequelize;
