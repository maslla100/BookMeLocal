'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Booking extends Model {
        static associate(models) {
            Booking.belongsTo(models.Service, { foreignKey: 'service_id' });
            Booking.belongsTo(models.User, { foreignKey: 'user_id' });
        }

        // Custom instance method to calculate the end time of a booking
        getEndTime() {
            const endTime = new Date(this.booking_time);
            endTime.setMinutes(endTime.getMinutes() + this.duration);
            return endTime;
        }
    }
    Booking.init({
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1,
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1,
            },
        },
        booking_time: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
            },
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 1, // Ensures duration is at least 1 minute
            },
        },
    }, {
        sequelize,
        modelName: 'Booking',
        timestamps: true,
        paranoid: true, // Enables soft deletes, adding a `deletedAt` field
    });
    return Booking;
};
