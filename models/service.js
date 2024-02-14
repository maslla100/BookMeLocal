'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Service extends Model {
        static associate(models) {
            Service.belongsTo(models.Business, { foreignKey: 'business_id' });
            Service.hasMany(models.Booking, { foreignKey: 'service_id' });
        }
    }
    Service.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 255], // Ensures the name is at least 3 characters and at most 255 characters
            },
        },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true, // Ensures the price is a decimal number
                min: 0.01, // Ensures the price is at least 0.01
            },
        },
        business_id: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'Service',
        timestamps: true,
        paranoid: true, // Allows soft deletion of records
    });
    return Service;
};
