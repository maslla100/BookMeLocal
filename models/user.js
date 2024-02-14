'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Business, { foreignKey: 'owner_id' });
            User.hasMany(models.Booking, { foreignKey: 'user_id' });
        }
    }
    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, // This line ensures the email field is validated as an email address
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 8);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) { // Only hash the password if it was changed
                    user.password = await bcrypt.hash(user.password, 8);
                }
            },
        },
        sequelize,
        modelName: 'User',
        timestamps: true,
        paranoid: true, // Enables soft deletes, adding a `deletedAt` field
    });
    return User;
};
