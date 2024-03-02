
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Business = require('./business')(sequelize, Sequelize.DataTypes);
db.Service = require('./service')(sequelize, Sequelize.DataTypes);
db.Booking = require('./booking')(sequelize, Sequelize.DataTypes);

// Defining associations
// User and Booking: One-to-Many relationship
db.User.hasMany(db.Booking, { foreignKey: 'user_id' });
db.Booking.belongsTo(db.User, { foreignKey: 'user_id' });

// Business and Service: One-to-Many relationship
db.Business.hasMany(db.Service, { foreignKey: 'business_id' });
db.Service.belongsTo(db.Business, { foreignKey: 'business_id' });

// Business and User (for business owners): One-to-One relationship
db.Business.belongsTo(db.User, { foreignKey: 'owner_id' });
db.User.hasOne(db.Business, { foreignKey: 'owner_id' });

// Service and Booking: One-to-Many relationship
db.Service.hasMany(db.Booking, { foreignKey: 'service_id' });
db.Booking.belongsTo(db.Service, { foreignKey: 'service_id' });

// Exporting models and sequelize instance
module.exports = db;
