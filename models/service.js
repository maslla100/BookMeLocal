const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Service extends Model { }

    Service.init(
        {
            // Define attributes for the Service model
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
                allowNull: true
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            business_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Businesses', // Reference the Business model
                    key: 'id'
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
                field: 'createdAt' // Explicitly specifying the database field name
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: 'updatedAt' // Explicitly specifying the database field name
            },
        },
        {
            sequelize,
            timestamps: true,
            freezeTableName: true,
            underscored: true,
            modelName: 'Service',
            //tableName: 'services',  // Explicitly specifying the table name
            tableName: 'Services',  // Explicitly specifying the table name


        });
    return Service;
};

//module.exports = Service;
