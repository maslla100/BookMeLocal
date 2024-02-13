'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add business
        const business = await queryInterface.bulkInsert('Businesses', [{
            name: 'Precision AutoCare Solutions',
            description: 'Complete auto care solutions from oil changes to dent removal.',
            owner_id: 1, // Assuming an owner with ID 1 exists
            hours: 'M-F 0700-1900',
            createdAt: new Date(),
            updatedAt: new Date()
        }], { returning: true });

        const businessId = business[0].id; // Get the inserted business ID

        // Add services for this business
        await queryInterface.bulkInsert('Services', [
            { name: 'Oil Change', description: 'Comprehensive oil change service.', price: 29.99, business_id: businessId, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Tire Rotation', description: 'Ensure even tire wear through rotation.', price: 19.99, business_id: businessId, createdAt: new Date(), updatedAt: new Date() },
            // Add other services...
        ]);

        // Add bookings for this business's services
        // Note: You'll need the service_id, which can be set assuming a known order or fetched based on the service name
        await queryInterface.bulkInsert('Bookings', [
            { service_id: 1, user_id: 2, booking_time: new Date('YYYY-MM-DD HH:MM'), duration: 120, createdAt: new Date(), updatedAt: new Date() },
            // Add other bookings...
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Revert seed here
    }
};
