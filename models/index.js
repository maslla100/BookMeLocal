require('dotenv').config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',

    dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
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
});

const models = {
    User: require('./user')(sequelize),
    Business: require('./business')(sequelize),
    Booking: require('./booking')(sequelize),
    Service: require('./service')(sequelize),
    BusinessHours: require('./businessHours')(sequelize),
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
