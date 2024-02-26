
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    class Booking extends Model { }


    Booking.init(
        {
            // Defining attributes as per the database schema
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            service_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'service',
                    key: 'id'
                }
            },
            /*user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },*/
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                field: 'user_id' // Mapping to the actual database column
            },
            booking_time: {
                type: DataTypes.DATE,
                allowNull: false
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'Duration in minutes'
            },
            /*createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            deletedAt: {
                type: DataTypes.DATE,
                defaultValue: null
            }*/
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
            deletedAt: {
                type: DataTypes.DATE,
                defaultValue: null,
                field: 'deletedAt' // Explicitly specifying the database field name
            }

        },
        {
            sequelize,
            timestamps: true,
            freezeTableName: true,
            underscored: true,
            modelName: 'Booking',
            tableName: 'Bookings',  // Explicitly specifying the table name
        });
    return Booking;

};

// Exporting the Booking model
//module.exports = Booking;
