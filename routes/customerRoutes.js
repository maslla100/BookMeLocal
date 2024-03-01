const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const servicesController = require('../controllers/servicesController');
const bookingController = require('../controllers/bookingController');
const { Business } = require('../models/index');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const businessController = require('../controllers/businessController')
const calendarController = require('../controllers/calendarController')



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


// Route for calendar Display!
router.get('/calendar', ensureAuthenticated, (req, res) => {
    console.log("Accessing the calendar page via customer Routes");
    res.render('booking/calendar');
});

//Route to view events on calendar
router.get('/customer/events', ensureAuthenticated, calendarController.getEvents);

//Route to create events on calendar
router.post('/customer/events', ensureAuthenticated, calendarController.createEvent);

//Route to create events on calendar
router.patch('/customer/events/:id', ensureAuthenticated, calendarController.updateEvent);

//Route to create events on calendar
router.delete('/customer/events/:id', ensureAuthenticated, calendarController.deleteEvent);

//Route to populate drop down menus on calendar for businesses
router.get('/customer/business', ensureAuthenticated, businessController.listBusinesses_norole);

//Route to populate drop down menus on calendar for services
router.get('/customer/service', ensureAuthenticated, servicesController.listServices_norole);
router.get('/customer/service/business:Id', ensureAuthenticated, servicesController.listServices_norole);



//Route to view services on customer Dashboard menu link
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
});




//router.post('/createbookings', ensureAuthenticated, ...bookingController.createBooking);
//router.get('/bookings/:id', ...bookingController.viewBookingDetails);
//router.post('/bookings/:id', ...bookingController.updateBooking);
//router.delete('/bookings/:id', ...bookingController.deleteBooking);

// View Business Services
router.get('/business/:id/services', (req, res) => {
    console.log("GET /business/:id/services route called");
    servicesController.listServices(req, res);
}); // In use 

//route to list services on customerDashboard
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


