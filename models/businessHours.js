'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class BusinessHours extends Model {
        static associate(models) {
            // Associate business hours with their business
            BusinessHours.belongsTo(models.Business, { foreignKey: 'business_id' });
        }
    }
    BusinessHours.init({
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Businesses',
                key: 'id',
            },
        },
        dayOfWeek: {
            type: DataTypes.ENUM,
            values: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            allowNull: false,
        },
        openTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validates time format HH:MM
            },
        },
        closeTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validates time format HH:MM
            },
        },
        // Example: isOpen field for special days or holidays
        isOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Assumes the business is open unless specified otherwise
        },
    }, {
        sequelize,
        modelName: 'BusinessHours',
        timestamps: false, // Assuming no need to track creation or update times for business hours
    });
    return BusinessHours;
};
