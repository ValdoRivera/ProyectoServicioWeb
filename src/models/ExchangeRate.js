const { DataTypes } = require('sequelize');
const { sequelize } = require('./databases');

const ExchangeRate = sequelize.define('ExchangeRate', {
  base: {                 // moneda base (USD)
    type: DataTypes.STRING(10),
    allowNull: false
  },
  quote: {                // moneda cotizada (MXN)
    type: DataTypes.STRING(10),
    allowNull: false
  },
  rate: {                 // 1 base = rate quote
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false
  },
  effectiveAt: {         // vigencia de la tasa
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'exchange_rates',
  indexes: [
    { fields: ['base', 'quote', 'effectiveAt'] }
  ],
  timestamps: true
});

module.exports = ExchangeRate;
