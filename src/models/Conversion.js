// src/models/Conversion.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Conversion = sequelize.define(
  "Conversion",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    fromSymbol: { type: DataTypes.STRING(10), allowNull: false, field: "from_symbol" },
    toSymbol: { type: DataTypes.STRING(10), allowNull: false, field: "to_symbol" },
    amount: { type: DataTypes.DECIMAL(32, 10), allowNull: false },
    result: { type: DataTypes.DECIMAL(32, 10), allowNull: false },
    base: { type: DataTypes.STRING(10), allowNull: false },
    meta: { type: DataTypes.JSON, allowNull: true },
  },
  { tableName: "conversions", timestamps: true, underscored: true }
);

module.exports = Conversion;