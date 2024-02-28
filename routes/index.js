const express = require('express');
const router = express.Router();


// Importing the individual route modules
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const adminRoutes = require('./adminRoutes');
const bookingRoutes = require('./bookingRoutes');
const businessRoutes = require('./businessRoutes');
const ownerRoutes = require('./ownerRoutes');
const serviceRoutes = require('./serviceRoutes');
const calendarRoutes = require('./calendarRoutes')

// Middleware for checking authentication and user roles
//const { ensureAuthenticated, redirectIfAuthenticated, ensureRole } = require('../middleware/authMiddleware');

// Define the route for the home page
router.get('/', (req, res) => {
    // Render the home page view
    res.render('home');
});

// Using the imported routes and applying role-based middleware where necessary
//router.use('/admin', ensureAuthenticated, ensureRole('admin'), adminRoutes);
//router.use('/auth', authRoutes); // Authentication routes don't require role checks
//router.use('/booking', ensureAuthenticated, bookingRoutes);
//router.use('/business', ensureAuthenticated, businessRoutes);
//router.use('/customer', ensureAuthenticated, ensureRole('customer'), customerRoutes);
//router.use('/owner', ensureAuthenticated, ensureRole('owner'), ownerRoutes);
//router.use('/service', ensureAuthenticated, serviceRoutes);

// Disable security for troubleshooting!!  Using the imported routes and applying role-based middleware where necessary
router.use('/auth', authRoutes); // Authentication routes don't require role checks
router.use('/customer', customerRoutes);
router.use('/admin', adminRoutes);
router.use('/booking', bookingRoutes);
router.use('/business', businessRoutes);
router.use('/owner', ownerRoutes);
router.use('/service', serviceRoutes);
router.use('/calendar', calendarRoutes);


//Catch-all for 404 errors
router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;
