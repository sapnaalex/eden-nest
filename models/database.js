// models/database.js
const { Sequelize } = require('sequelize');

// Initializes a local SQLite database file named "edennest.sqlite"
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './edennest.sqlite',
    logging: false
});

module.exports = sequelize;