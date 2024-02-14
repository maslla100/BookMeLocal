'use strict';
const { sequelize } = require('../models/index');
const { User, Business } = sequelize.models;


module.exports = {
    async up() {
        // Example: Using a specific owner's email to find the owner
        const ownerEmail = 'owner@tranquilterrascapes.com'; // Adjust based on your actual data
        const owner = await User.findOne({ where: { email: ownerEmail } });

        if (!owner) {
            console.log(`Owner with email ${ownerEmail} not found. Skipping business insertion.`);
            return;
        }

        await Business.create({
            name: 'Tranquil TerraScapes',
            description: 'Complete modern yard care, from lawn care to landscape design.',
            owner_id: owner.id, // Dynamically set owner_id based on found owner
            hours: 'M-F 0800-1800', // Adjust hours to correctly represent the business operation hours
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },


    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Businesses', { where: { name: 'Tranquil TerraScapes' } });
    }

};
