// models/user.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class User extends Model { }

User.init({
    // Define attributes
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'user',
});

module.exports = User;
