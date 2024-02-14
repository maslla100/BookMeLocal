'use strict';

const insertServices = require('./insertServices');

module.exports = {
    async up(queryInterface, Sequelize) {
        await insertServices(queryInterface, Sequelize);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Services', null, {});
    }
};