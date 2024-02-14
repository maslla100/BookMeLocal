'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Assuming an owner with ID 1 exists, replace 1 with the actual expectedOwnerId if dynamic
        const expectedOwnerId = 1;
        // Attempt to find the user by ID
        const userExists = await queryInterface.rawSelect('Users', {
            where: {
                id: expectedOwnerId,
            },
        }, ['id']);

        if (!userExists) {
            console.log(`No user found with id ${expectedOwnerId}, skipping business insertion.`);
            return; // Exit if no user found
        }

        // Proceed with business insertion since user exists
        const businessData = [{
            name: 'Precision AutoCare Solutions',
            description: 'Complete auto care solutions from oil changes to dent removal.',
            owner_id: expectedOwnerId, // Use the variable to make it clearer
            hours: 'M-F 0700-1900',
            createdAt: new Date(),
            updatedAt: new Date()
        }];

        // Note: bulkInsert does not return inserted entries in the same way across all dialects, this may not work as expected
        await queryInterface.bulkInsert('Businesses', businessData);

        // Assuming businessId is required for related services or bookings, you might need a different approach
        // to reliably get the businessId, as bulkInsert might not return it depending on the database/dialect
        // For simplicity, this example assumes services and bookings are not dependent on the inserted business ID
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Businesses', null, { where: { name: 'Precision AutoCare Solutions' } });
        // Optionally add deletion of related services and bookings if needed
    }
};

