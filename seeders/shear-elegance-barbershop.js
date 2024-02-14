'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Assuming business IDs are handled manually or retrieved via a separate query
        const businessIdShearElegance = 2; // Example ID, adjust based on actual ID

        // Services for Shear Elegance Barbershop
        const servicesShearElegance = [
            { name: 'Hair Cut', description: 'Professional hair cutting service.', price: 25.00, business_id: businessIdShearElegance, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Head Massage', description: 'Relaxing head massage.', price: 15.00, business_id: businessIdShearElegance, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Beard Trimming', description: 'Precise beard trimming.', price: 20.00, business_id: businessIdShearElegance, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Hair Coloring', description: 'Full hair coloring services.', price: 40.00, business_id: businessIdShearElegance, createdAt: new Date(), updatedAt: new Date() }
        ];

        await queryInterface.bulkInsert('Services', servicesShearElegance);

        // Example bookings for Shear Elegance Barbershop
        // Note: Ensure to adjust `service_id` and `user_id` based on actual IDs
        const bookingsShearElegance = [
            { service_id: 5, user_id: 1, booking_time: new Date('2023-03-06 10:00'), duration: 30, createdAt: new Date(), updatedAt: new Date() },
            { service_id: 6, user_id: 2, booking_time: new Date('2023-03-14 17:30'), duration: 45, createdAt: new Date(), updatedAt: new Date() },
            { service_id: 7, user_id: 3, booking_time: new Date('2023-03-26 13:00'), duration: 60, createdAt: new Date(), updatedAt: new Date() }
        ];

        await queryInterface.bulkInsert('Bookings', bookingsShearElegance);
    },

    async down(queryInterface, Sequelize) {
        // Revert seed here, potentially removing bookings and services by business_id
    }
};
