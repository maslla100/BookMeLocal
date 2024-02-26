'use strict';

const { sequelize } = require('../models/index');
const { User, Business, Service, Booking } = sequelize.models;
const bookingData = require('./bookingData'); // Adjust the path as necessary

async function insertBookings() {
    for (const booking of bookingData) {
        try {
            // Find the user ID
            const user = await User.findOne({ where: { email: booking.userEmail } });
            if (!user) {
                console.log(`User not found: ${booking.userEmail}. Skipping booking.`);
                continue;
            }

            console.log(`User found: ${user.id} for email: ${booking.userEmail}`);

            // Find the service ID
            const business = await Business.findOne({ where: { name: booking.businessName } });
            if (!business) {
                console.log(`Business not found: ${booking.businessName}. Skipping booking.`);
                continue;
            }

            const service = await Service.findOne({
                where: {
                    name: booking.serviceName,
                    business_id: business.id
                }
            });
            if (!service) {
                console.log(`Service not found: ${booking.serviceName}. Skipping booking.`);
                continue;
            }

            console.log(`Service found: ${service.id} for name: ${booking.serviceName}`);

            // Create the booking
            await Booking.create({
                service_id: service.id, // Use snake_case here if your DB column is snake_case
                userId: user.id,       // Use camelCase here to match the model definition
                booking_time: booking.bookingDetails.booking_time, // Use snake_case if your DB column is snake_case
                duration: booking.bookingDetails.duration
            });

        } catch (error) {
            console.error(`Error creating booking for ${booking.userEmail}:`, error);
        }
    }
}


module.exports = {
    async up(queryInterface, Sequelize) {
        await insertBookings();
    },

    async down(queryInterface, Sequelize) {
        // You might want to adjust the down function based on how you want to handle rollbacks.
        await queryInterface.bulkDelete('Bookings', null, {});
    }
};
