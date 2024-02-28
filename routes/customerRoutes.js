const express = require('express');
const router = express.Router();
//const authController = require('../controllers/authController');
const customerController = require('../controllers/customerController');
const servicesController = require('../controllers/servicesController');
const bookingController = require('../controllers/bookingController');
const { Business } = require('../models/index');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const businessController = require('../controllers/businessController')


// Middleware for logging
const logCustomerDashboardAccess = (req, res, next) => {
    console.log("Accessing customer dashboard route");
    next(); // Pass control to the next handler, which is showDashboard in this case
};

// Route for the Customer's dashboard
router.get('/customerDashboard', logCustomerDashboardAccess, customerController.showDashboard);

// Profile Management
router.get('/profile', ...customerController.viewProfile);  //In use
//router.post('/profile', ...customerController.updateProfile);

// Booking Management
router.get('/bookings', ...bookingController.listBookings);  //In use - My Bookings link


// In customerRoutes.js
router.get('/calendar', ensureAuthenticated, (req, res) => {
    console.log("Accessing the calendar page via /customer/calendar");
    res.render('booking/calendar');
});





//Route to view services on customer Dashboard
router.get('/services', ensureAuthenticated, ...servicesController.listServices);


router.get('/createbookings', ensureAuthenticated, async (req, res) => {
    try {
        const businesses = await Business.findAll();
        const plainBusinesses = businesses.map(business => business.get({ plain: true }));

        console.log("Fetched businesses:", plainBusinesses);
        res.render('booking/createBooking', { businesses: plainBusinesses });
    } catch (error) {
        console.error('Error rendering createBooking page:', error);
        res.status(500).send('Internal Server Error');
    }
});  //In use

//router.post('/createbookings', ensureAuthenticated, ...bookingController.createBooking);
//router.get('/bookings/:id', ...bookingController.viewBookingDetails);
//router.post('/bookings/:id', ...bookingController.updateBooking);
//router.delete('/bookings/:id', ...bookingController.deleteBooking);

// View Business Services
/*router.get('/business/:id/services', (req, res) => {
    console.log("GET /business/:id/services route called");
    servicesController.listServices(req, res);
}); // In use */

router.get('/listBusiness', ensureAuthenticated, businessController.listBusinesses);

//Business and Services route for booking appointments - In use
router.get('/services/:businessId', async (req, res) => {
    try {
        const businesses = await Business.findAll({
            attributes: ['id', 'name'], // Fetch only necessary attributes
            distinct: true // This can help avoid duplicates if there are joins causing them
        });

        const services = await Service.findAll({
            where: { business_id: businessId },
            attributes: ['id', 'name'] // Fetch only necessary attributes
        });
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;


