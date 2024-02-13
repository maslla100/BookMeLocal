const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,    // 'localhost'
        dialect: 'mysql',
        port: 3306,
        dialectOptions: {
            // Include SSL configuration here if needed for production
        }
    }
);

module.exports = sequelize;
