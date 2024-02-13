'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const dataPath = path.join(__dirname, 'userData.json');
        const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        for (const user of usersData) {
            user.password = await bcrypt.hash(user.password, 10);
            user.createdAt = new Date();
            user.updatedAt = new Date();
        }

        await queryInterface.bulkInsert('Users', usersData, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
