const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('usuario', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:   { type: DataTypes.STRING,  allowNull: false },
  email:    { type: DataTypes.STRING,  allowNull: false, unique: true },
  password: { type: DataTypes.STRING,  allowNull: false },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
