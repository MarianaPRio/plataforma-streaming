const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const cfg = require('../../config/config.js')[env];

const sequelize = new Sequelize(cfg.url, {
  dialect: cfg.dialect,
  logging: false,
});

module.exports = sequelize;