const { sequelize } = require('../models');
const { User, Service, Booking } = sequelize.models;
const bookingData = require('./bookingData');

async function findUserByEmail(email) {
    return User.findOne({ where: { email } });
}

async function findServiceByName(name) {
    return Service.findOne({ where: { name } });
}

async function createBookings() {
    for (const { serviceName, userEmail, bookingDetails } of bookingData) {
        const user = await findUserByEmail(userEmail);
        const service = await findServiceByName(serviceName);

        if (!user || !service) {
            console.log(`Skipping booking for ${serviceName} - User or Service not found.`);
            continue;
        }

        await Booking.create({
            user_id: user.id,
            service_id: service.id,
            ...bookingDetails,
        });
    }
}

module.exports = createBookings;
