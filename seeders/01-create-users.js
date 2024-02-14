'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Ensure this path is correct

module.exports = {
    async up(queryInterface, Sequelize) {
        const dataPath = path.join(__dirname, '../seeders/userData.json'); // Adjust the path as necessary
        const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        for (const userData of usersData) {
            try {
                const existingUser = await User.findOne({ where: { email: userData.email } });
                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(userData.password, 10);
                    await User.create({
                        ...userData,
                        password: hashedPassword,
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
        // Re-read usersData within the down function to ensure it's available
        const dataPath = path.join(__dirname, '../seeders/userData.json');
        const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const emails = usersData.map(user => user.email);

        await User.destroy({
            where: { email: emails }
        });
    }

};

