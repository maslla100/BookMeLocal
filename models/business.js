const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Business extends Model { }

    Business.init({
        // Define attributes specific to businesses
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        hours: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Business',
        timestamps: true,
        paranoid: true, // Enable soft deletes
        tableName: 'Businesses',  // Explicitly specifying the table name

    });

    return Business;
};

// Exporting the Booking model
//module.exports = Business;