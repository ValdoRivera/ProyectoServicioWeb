const { DataTypes } = require("sequelize");
const sequelize = require('../config/db');

const recorrido = sequelize.define("recorrido", {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tiempo: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "recorridos",
  timestamps: false
});
module.exports = recorrido;