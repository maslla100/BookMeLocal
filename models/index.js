const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const envConfig = require('../config/config.js')[env];
const { database, username, password, ...sequelizeOptions } = envConfig;
const sequelize = new Sequelize(database, username, password, sequelizeOptions);



// Importing models
const User = require('./user')(sequelize);
const Business = require('./business')(sequelize);
const Service = require('./service')(sequelize);
const Booking = require('./booking')(sequelize);

// Defining associations
// User and Booking: One-to-Many relationship
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

// Business and Service: One-to-Many relationship
Business.hasMany(Service, { foreignKey: 'business_id' });
Service.belongsTo(Business, { foreignKey: 'business_id' });

// Business and User (for business owners): One-to-One relationship
Business.belongsTo(User, { foreignKey: 'owner_id' });
User.hasOne(Business, { foreignKey: 'owner_id' });

// Service and Booking: One-to-Many relationship
Service.hasMany(Booking, { foreignKey: 'service_id' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });

// Exporting models and sequelize instance
module.exports = {
    sequelize,
    Sequelize,
    User,
    Business,
    Service,
    Booking
};

