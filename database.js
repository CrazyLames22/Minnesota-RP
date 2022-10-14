require('dotenv').config()
const { Sequelize } = require('sequelize');
module.exports = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`, {logging: false});