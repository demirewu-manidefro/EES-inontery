const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log if you want to see SQL queries
    dialectOptions: {
        // Uncomment for production (e.g., Render, Heroku)
        // ssl: {
        //   require: true,
        //   rejectUnauthorized: false
        // }
    }
});

module.exports = sequelize;
