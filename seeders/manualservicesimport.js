'use strict';

const serviceData = [
    {
        businessName: 'Precision AutoCare Solutions',
        services: [
            { name: 'Oil Change', description: 'Comprehensive oil change service.', price: 29.99 },
            { name: 'Tire Rotation', description: 'Ensure even tire wear through rotation.', price: 19.99 },
            { name: 'Flat Tire Repair', description: 'Quick and reliable flat tire repair.', price: 15.99 },
            { name: 'Dent Removal', description: 'Efficient dent removal to restore vehicle body.', price: 99.99 },
        ],
    },
    {
        businessName: 'Shear Elegance Barbershop',
        services: [
            { name: 'Hair Cut', description: 'Professional and stylish hair cutting service.', price: 25.00 },
            { name: 'Head Massage', description: 'Relaxing head massage for stress relief.', price: 30.00 },
            { name: 'Beard Trimming', description: 'Precise beard trimming for a neat look.', price: 20.00 },
            { name: 'Hair Coloring', description: 'High-quality hair coloring services.', price: 40.00 },
        ],
    },
    {
        businessName: 'Tranquil TerraScapes',
        services: [
            { name: 'Lawn cutting', description: 'Professional and stylish Lawn cutting service.', price: 55.00 },
            { name: 'Tree trimming', description: 'Professional and stylish Tree trimming service.', price: 80.00 },
            { name: 'Leaf removal', description: 'Professional Leaf removal service.', price: 20.00 },
            { name: 'Hardscaping', description: 'Professional and stylish Hardscaping service.', price: 400.00 },
        ],
    },
    // Add more businesses and their services as needed...
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        for (const group of serviceData) {
            const business = await queryInterface.rawSelect('Businesses', {
                where: {
                    name: group.businessName,
                },
            }, ['id']);

            if (business) {
                for (const service of group.services) {
                    await queryInterface.bulkInsert('Services', [{
                        name: service.name,
                        description: service.description,
                        price: service.price,
                        business_id: business,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }]);
                }
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Services', null, {});
    }
};
