

const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const businessController = require('../controllers/businessController');
const bookingController = require('../controllers/bookingController');
const servicesController = require('../controllers/servicesController');
//const { ensureAuthenticated, ensureOwner } = require('../middleware/authMiddleware');

// Route to display owner dashboard
router.get('owner/dashboard', ownerController.showDashboard);

// Routes for managing business details
//router.get('/business/details', [ensureAuthenticated, ensureOwner], businessController.viewBusinessDetails);
router.get('/business/details', businessController.viewBusinessDetails);

//router.post('/business/update', [ensureAuthenticated, ensureOwner], businessController.updateBusinessDetails);
router.post('/business/update', businessController.updateBusinessDetails);


// Routes for managing services offered by the business
//router.get('/services/list', [ensureAuthenticated, ensureOwner], servicesController.listServices);
//router.get('/services/list', servicesController.listServices);

//router.post('/services/add', [ensureAuthenticated, ensureOwner], servicesController.createService);
//router.post('/services/add', servicesController.createService);


//router.post('/services/update/:id', [ensureAuthenticated, ensureOwner], servicesController.editService);
//router.post('/services/update/:id', servicesController.editService);

//router.post('/services/delete/:id', [ensureAuthenticated, ensureOwner], servicesController.deleteService);
//router.post('/services/delete/:id', servicesController.deleteService);



// Routes for viewing and managing bookings
//router.get('/bookings', [ensureAuthenticated, ensureOwner], bookingController.listBookings);
router.get('/bookings', bookingController.listBookings);

//router.post('/bookings/update/:id', [ensureAuthenticated, ensureOwner], bookingController.updateBooking);
router.post('/bookings/update/:id', bookingController.updateBooking);

//router.post('/bookings/delete/:id', [ensureAuthenticated, ensureOwner], bookingController.deleteBooking);
router.post('/bookings/delete/:id', bookingController.deleteBooking);

module.exports = router;