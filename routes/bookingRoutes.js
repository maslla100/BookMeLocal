const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');
const { Service } = require('../models/index');

// Route to handle the creation of a new booking
// Only authenticated users with the 'customer' role can access this route
//router.post('/create', ensureAuthenticated, ensureRole('customer'), bookingController.createBooking);
router.post('/create', bookingController.createBooking);


// Route to modify an existing booking
// Only the customer who created the booking or an admin can modify the booking
//router.put('/modify/:bookingId', ensureAuthenticated, bookingController.updateBooking);
router.put('/modify/:bookingId', bookingController.updateBooking);


// Route to delete an existing booking
// Both the customer who created the booking and admins can delete the booking
//router.delete('/delete/:bookingId', ensureAuthenticated, bookingController.deleteBooking);
router.delete('/delete/:bookingId', bookingController.deleteBooking);


// Route to list all bookings for a customer
// Accessible only by the customer to view their own bookings
//router.get('/list/all', ...bookingController.listBookings);


//Business and Services route for booking appointments





// Route to list all bookings for a specific business
// Only accessible by the business owner or an admin
//router.get('/list/business/:businessId', ensureAuthenticated, ensureRole('owner', 'admin'), bookingController.listBookings);
router.get('/list/business/:businessId', bookingController.listBookings);


// Route for customers to view details of a specific booking
// Customers can only view their own booking details
//router.get('/details/:bookingId', ensureAuthenticated, ensureRole('customer'), bookingController.viewBookingDetails);
router.get('/details/:bookingId', bookingController.viewBookingDetails);

// In customerRoutes.js





module.exports = router;
