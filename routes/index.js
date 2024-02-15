// routes/index.js

const authRoutes = require('./authRoutes');
const businessRoutes = require('./businessRoutes');
const bookingRoutes = require('./bookingRoutes');
const serviceRoutes = require('./serviceRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Any additional route files you have

module.exports = (app) => {
    app.use('/auth', authRoutes);
    app.use('/businesses', businessRoutes);
    app.use('/bookings', bookingRoutes);
    app.use('/services', serviceRoutes);
    app.use('/dashboard', dashboardRoutes);
    // Use any additional routes


    app.get('/', (req, res) => {
        res.render('home');
    });

    // Catch-all for 404 errors
    app.use((req, res, next) => {
        res.status(404).render('404');
    });
};
