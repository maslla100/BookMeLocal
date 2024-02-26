const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const adminController = require('../controllers/adminController');
const businessController = require('../controllers/businessController');
const servicesController = require('../controllers/servicesController');
//const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if the user is authenticated and an admin
//router.use(authMiddleware.ensureAuthenticated, authMiddleware.ensureAdmin);

//Route to show adminDashboard
router.get('admin/adminDashboard', adminController.showDashboard);

// Route to list all users
router.get('/users', adminController.listUsers);

// Route to create a new user
router.post('/users', adminController.createUser);

// Route to edit an existing user
router.put('/users/:id', adminController.editUser);

// Route to delete a user
router.delete('/users/:id', adminController.deleteUser);

// Route to list all businesses
router.get('/businesses', businessController.listBusinesses);

// Route to create a new business
router.post('/businesses', businessController.createBusiness);

// Route to edit an existing business
router.put('/businesses/:id', businessController.updateBusinessDetails);

// Route to delete a business
router.delete('/businesses/:id', businessController.deleteBusiness);

// Route to list all services
//router.get('/services', servicesController.listServices);

// Route to create a new service
//router.post('/services', servicesController.createService);

// Route to edit an existing service
//router.put('/services/:id', servicesController.editService);

// Route to delete a service
//router.delete('/services/:id', servicesController.deleteService);

// Route to view all bookings
router.get('/bookings', bookingController.listBookings);

// Route to edit a booking
router.put('/bookings/:id', bookingController.updateBooking);

// Route to delete a booking
router.delete('/bookings/:id', bookingController.deleteBooking);

// Route to assign an owner to a business
//router.post('/assign-owner', businessController.assignOwner);

// Route to change the role of a user
//router.put('/change-role/:userId', authController.changeUserRole);

module.exports = router;
