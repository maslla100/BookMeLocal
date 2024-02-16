const express = require('express');
const router = express.Router();
const { Booking, Service } = require('../models');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const { validationResult, body } = require('express-validator');

// GET route to display the booking form with a list of services
router.get('/new', checkAuthenticated, async (req, res) => {
    const services = await Service.findAll();
    res.render('booking/new', { services });
});

// POST route to create a new booking with input validation
router.post('/', [
    checkAuthenticated,
    body('service_id').isInt(),
    body('booking_time').isISO8601(),
    body('duration').isInt({ min: 1 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Handle errors, perhaps by re-rendering the form with error messages
        req.flash('error_msg', 'Please correct the errors in the form');
        return res.redirect('/bookings/new');
    }

    try {
        const { service_id, user_id, booking_time, duration } = req.body;
        await Booking.create({ service_id, user_id, booking_time, duration });
        req.flash('success_msg', 'Booking created successfully');
        res.redirect('/dashboard');
    } catch (error) {
        req.flash('error_msg', 'Error creating booking');
        res.redirect('/bookings/new');
    }
});

// GET route to retrieve a user's bookings and display them
router.get('/user/:userId', checkAuthenticated, async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.findAll({
            where: { user_id: userId },
            include: [Service],
        });
        res.render('bookings/list', { bookings });
    } catch (error) {
        req.flash('error_msg', 'Error fetching bookings');
        res.redirect('/dashboard');
    }
});

// PUT route to update a booking with input validation
router.put('/:bookingId', [
    checkAuthenticated,
    body('booking_time').isISO8601().withMessage('Invalid booking time'),
    body('duration').isInt({ min: 1 }).withMessage('Invalid duration'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const bookingId = req.params.bookingId;
        const { booking_time, duration } = req.body;
        await Booking.update({ booking_time, duration }, {
            where: { id: bookingId }
        });
        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE route to delete a booking
router.delete('/:bookingId', checkAuthenticated, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        await Booking.destroy({
            where: { id: bookingId }
        });
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET route for editing a booking form
router.get('/:bookingId/edit', checkAuthenticated, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.bookingId, {
            include: [Service]
        });
        if (!booking) {
            req.flash('error_msg', 'Booking not found');
            return res.redirect('/dashboard');
        }

        res.render('bookings/edit', { booking });
    } catch (error) {
        console.error('Error getting booking for edit:', error);
        req.flash('error_msg', 'Error loading edit form');
        res.redirect('/dashboard');
    }
});

// DELETE route for canceling a booking
router.delete('/:bookingId', checkAuthenticated, async (req, res) => {
    try {
        await Booking.destroy({
            where: { id: req.params.bookingId }
        });
        req.flash('success_msg', 'Booking canceled successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error canceling booking:', error);
        req.flash('error_msg', 'Error canceling booking');
        res.redirect('/dashboard');
    }
});


module.exports = router;
