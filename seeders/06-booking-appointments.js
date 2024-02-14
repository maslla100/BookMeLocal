'use strict';

const createBookings = require('./createBookings');

module.exports = {
    async up() {
        await createBookings();
    },

    async down(queryInterface, Sequelize) {
        // Logic to remove inserted bookings if necessary
    }
};
