'use strict';

const { sequelize } = require('../models/index');
const { User, Business } = sequelize.models;


module.exports = {
    async up() {
        // Example: Using a specific owner's email to find the owner
        const ownerEmail = 'owner@shearelegancebarbershop.com'; // Adjust based on your data
        const owner = await User.findOne({ where: { email: ownerEmail } });

        if (!owner) {
            console.log(`Owner with email ${ownerEmail} not found. Skipping business insertion.`);
            return;
        }

        await Business.create({
            name: 'Shear Elegance Barbershop',
            description: 'Complete modern man care, from haircuts to beard care.',
            owner_id: owner.id, // Dynamically set owner_id based on found owner
            hours: 'T-TH 1000-2000', // Adjust hours to match the business operation hours correctly
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },

    async down(queryInterface, Sequelize) {
        // Assumes you are using Sequelize queryInterface in the down method
        await queryInterface.bulkDelete('Businesses', { where: { name: 'Shear Elegance Barbershop' } });
    }

};
