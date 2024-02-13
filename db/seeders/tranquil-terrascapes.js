'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Assuming business IDs are handled manually or retrieved via a separate query
        const businessIdTranquilTerraScapes = 3; // Example ID, adjust based on actual ID

        // Services for Tranquil TerraScapes
        const servicesTranquilTerraScapes = [
            { name: 'Lawn Cutting', description: 'Regular lawn cutting service.', price: 30.00, business_id: businessIdTranquilTerraScapes, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Tree Trimming', description: 'Professional tree trimming for health and aesthetics.', price: 50.00, business_id: businessIdTranquilTerraScapes, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Leaf Removal', description: 'Complete leaf removal to keep your yard clean.', price: 25.00, business_id: businessIdTranquilTerraScapes, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Hardscaping', description: 'Custom hardscaping services to enhance your outdoor space.', price: 100.00, business_id: businessIdTranquilTerraScapes, createdAt: new Date(), updatedAt: new Date() }
        ];

        await queryInterface.bulkInsert('Services', servicesTranquilTerraScapes);

        // Example bookings for Tranquil TerraScapes
        // Note: Ensure to adjust `service_id` and `user_id` based on actual IDs
        const bookingsTranquilTerraScapes = [
            { service_id: 9, user_id: 4, booking_time: new Date('2023-03-08 08:00'), duration: 600, createdAt: new Date(), updatedAt: new Date() }, // 10 hours
            { service_id: 10, user_id: 1, booking_time: new Date('2023-03-19 09:00'), duration: 240, createdAt: new Date(), updatedAt: new Date() }, // 4 hours
            { service_id: 11, user_id: 2, booking_time: new Date('2023-03-12 08:30'), duration: 120, createdAt: new Date(), updatedAt: new Date() } // 2 hours
        ];

        await queryInterface.bulkInsert('Bookings', bookingsTranquilTerraScapes);
    },

    async down(queryInterface, Sequelize) {
        // Revert seed here, potentially removing bookings and services by business_id
    }
};
