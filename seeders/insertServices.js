const { sequelize } = require('../models');
const { Business, Service } = sequelize.models;
const serviceData = require('./serviceData');

async function insertServices() {
    for (const { businessName, services } of serviceData) {
        const business = await Business.findOne({ where: { name: businessName } });
        if (!business) {
            console.log(`Business not found: ${businessName}. Skipping service insertion.`);
            continue;
        }

        for (const service of services) {
            await Service.create({
                ...service,
                business_id: business.id,
            });
        }
    }
}

module.exports = insertServices;
