require('dotenv').config();
const parseDbUrl = require("parse-database-url");

let config;
if (process.env.JAWSDB_URL) {
    // Production configuration with JawsDB
    const jawsDbConfig = parseDbUrl(process.env.JAWSDB_URL);
    config = {
        username: jawsDbConfig.user,
        password: jawsDbConfig.password,
        database: jawsDbConfig.database,
        host: jawsDbConfig.host,
        port: jawsDbConfig.port,
        dialect: 'mysql', // Explicitly setting the dialect
        dialectOptions: jawsDbConfig.ssl ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    };
} else {
    // Local development configuration
    config = {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: 3306,
        dialect: 'mysql', // Explicitly setting the dialect
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
}

module.exports = config;
