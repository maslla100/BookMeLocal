'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Business extends Model {
        static associate(models) {
            // Associate a business with its owner
            Business.belongsTo(models.User, { foreignKey: 'owner_id' });
            // Associate a business with its services
            Business.hasMany(models.Service, { foreignKey: 'business_id' });
        }
    }
    Business.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true, // Ensures name is not empty
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true, // Ensures description is not empty
            },
        },
        hours: {
            type: DataTypes.STRING,
            allowNull: true, // Assuming hours can be nullable
            validate: {
                // Optional: Add validation for hours format if there's a specific format you follow
            },
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // Allows null on delete
            references: {
                model: 'Users', // Specifies the model this foreignKey references
                key: 'id',
            },
        },
    }, {
        sequelize,
        modelName: 'Business',
        timestamps: true,
        paranoid: true, // Consider enabling soft deletes if applicable
    });
    return Business;
};
