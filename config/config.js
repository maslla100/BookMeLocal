require('dotenv').config();
const parseDbUrl = require("parse-database-url");

let productionConfig = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306,
    dialectOptions: {
        ssl: process.env.DB_SSL ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

let developmentConfig = {};

// Check if JAWSDB_URL is available to use JawsDB on Heroku
if (process.env.JAWSDB_URL) {
    const jawsDbConfig = parseDbUrl(process.env.JAWSDB_URL);
    productionConfig = {
        username: jawsDbConfig.user,
        password: jawsDbConfig.password,
        database: jawsDbConfig.database,
        host: jawsDbConfig.host,
        dialect: 'mysql',
        port: jawsDbConfig.port,
        dialectOptions: jawsDbConfig.ssl ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    };
}

module.exports = {
    development: developmentConfig,
    production: productionConfig
    // You can add more environments here, like test and production
};
