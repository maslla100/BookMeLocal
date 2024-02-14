'use strict';


const { sequelize } = require('../models/index'); // Might need adjustment based on the exact location
const { User, Business } = sequelize.models;

module.exports = {
    async up() {
        const ownerEmail = 'owner@precisionautocare.com'; // Use a valid email from your users
        const owner = await User.findOne({ where: { email: ownerEmail } });

        if (!owner) {
            console.log(`Owner with email ${ownerEmail} not found. Skipping business insertion.`);
            return;
        }

        await Business.create({
            name: 'Precision AutoCare Solutions',
            description: 'Complete auto care solutions from oil changes to dent removal.',
            owner_id: owner.id,
            hours: 'M-F 0700-1900',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('Businesses', { where: { name: 'Precision AutoCare Solutions' } });
    }
};
