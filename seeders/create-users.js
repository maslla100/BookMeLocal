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
        }
    },

    async down(queryInterface, Sequelize) {
        // Assuming email addresses in usersData are unique and known
        const emails = usersData.map(user => user.email);
        await User.destroy({
            where: {
                email: emails
            }
        });
    }
};

