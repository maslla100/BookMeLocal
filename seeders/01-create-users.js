'use strict';

const fs = require('fs');
const path = require('path');
const { User } = require('../models/index'); // Ensure this path is correct

module.exports = {
    async up(queryInterface, Sequelize) {
        const dataPath = path.join(__dirname, '../seeders/userData.json');
        const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        for (const userData of usersData) {
            try {
                const existingUser = await User.findOne({ where: { email: userData.email.toLowerCase() } });
                if (!existingUser) {
                    await User.create({
                        email: userData.email.toLowerCase(),
                        password: userData.password,
                        role: userData.role || 'customer',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                } else {
                    console.log(`User with email ${userData.email} already exists. Skipping.`);
                }
            } catch (error) {
                console.error(`Error creating user ${userData.email}:`, error);
            }
        }
    },
    async down(queryInterface, Sequelize) {
        const dataPath = path.join(__dirname, '../seeders/userData.json');
        const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const emails = usersData.map(user => user.email.toLowerCase());

        await User.destroy({
            where: { email: emails }
        });
    }
};
