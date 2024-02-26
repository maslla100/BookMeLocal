const { Booking, User, Service, Business } = require('../models');
const { validationResult } = require('express-validator');
const {
    bookingValidationRules,
    editBookingValidationRules
} = require('../middleware/validationRules');
const { ensureAuthenticated, ensureAdmin, ensureOwner } = require('../middleware/authMiddleware');

const bookingController = {

    // View booking details
    viewBookingDetails: [ensureAuthenticated, async (req, res) => {
        try {
            const { bookingId } = req.params;
            const booking = await Booking.findByPk(bookingId, {
                include: [{
                    model: Service,
                    include: [Business]
                }, User]
            });

            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }
            // Allow admins to view any booking details
            if (req.user.role === 'admin') {
                return res.status(200).json(booking);
            }
            // Check if the user is allowed to view the booking details
            if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
                return res.status(403).json({ message: "Customers can only view their own booking details." });
            }

            if (req.user.role === 'owner') {
                if (booking.Service.Business.owner_id !== req.user.id) {
                    return res.status(403).json({ message: "Owners can only view bookings for their own business." });
                }
            }

            res.status(200).json(booking);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }],

    listBookings: [ensureAuthenticated, async (req, res) => {
        try {
            let bookings;
            if (req.user.role === 'admin') {
                // Admin: List all bookings
                bookings = await Booking.findAll({
                    include: [
                        {
                            model: Service,
                            attributes: ['name'], // Service name
                            include: [{
                                model: Business,
                                attributes: ['name'] // Business name
                            }]
                        }
                    ],
                    attributes: ['id', 'booking_time', 'duration'] // Booking details
                });
            } else if (req.user.role === 'owner') {
                // Owner: List bookings for owned businesses
                bookings = await Booking.findAll({
                    include: [{
                        model: Service,
                        attributes: ['name'], // Service name
                        include: [{
                            model: Business,
                            where: { owner_id: req.user.id },
                            attributes: ['name'] // Business name
                        }]
                    }],
                    attributes: ['id', 'booking_time', 'duration'] // Booking details
                });
            } else {
                // Customer: List own bookings
                bookings = await Booking.findAll({
                    where: { user_id: req.user.id },
                    include: [
                        {
                            model: Service,
                            attributes: ['name'], // Service name
                            include: [{
                                model: Business,
                                attributes: ['name'] // Business name
                            }]
                        }
                    ],
                    attributes: ['id', 'booking_time', 'duration'] // Booking details
                });
            }

            // Convert Sequelize objects to plain JavaScript objects
            bookings = bookings.map(booking => booking.get({ plain: true }));

            // Render the Handlebars view and pass the bookings data
            console.log(bookings);
            res.render('booking/listBooking', { bookings });
        } catch (error) {
            console.error('Error in showDashboard:', error);
            res.status(400).json({ error: error.message });
        }
    }],


    // Create a new booking
    createBooking: [ensureAuthenticated, bookingValidationRules(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { businessName, serviceName, userEmail, bookingDetails } = req.body;
        const { booking_time, duration } = bookingDetails;
        const loggedInUserId = req.user.id;
        const userRole = req.user.role;

        try {
            // Fetch the business based on businessName
            const business = await Business.findOne({ where: { name: businessName } });
            if (!business) {
                return res.status(404).json({ error: "Business not found." });
            }

            // Fetch the service ID based on serviceName and businessId
            const service = await Service.findOne({ where: { name: serviceName, business_id: business.id } });
            if (!service) {
                return res.status(404).json({ error: "Service not found." });
            }

            // Fetch the user ID based on userEmail
            const user = await User.findOne({ where: { email: userEmail } });
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            // Check if the customer is creating a booking for themselves
            if (userRole === 'customer' && user.id !== loggedInUserId) {
                return res.status(403).json({ message: "Customers can only create bookings for themselves." });
            }

            // Create the booking
            const newBooking = await Booking.create({
                service_id: service.id,
                user_id: user.id,
                booking_time: booking_time,
                duration: duration
            });
            res.status(201).json(newBooking);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }],



    // Update a booking
    updateBooking: [ensureAuthenticated, editBookingValidationRules(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookingId } = req.params;
        const { booking_time, duration } = req.body;

        try {
            const booking = await Booking.findByPk(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }

            // Check if the user is allowed to update the booking
            if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
                return res.status(403).json({ message: "Customers can only update their own bookings." });
            }

            if (req.user.role === 'owner') {
                const service = await Service.findByPk(booking.service_id);
                const business = await Business.findByPk(service.business_id);
                if (business.owner_id !== req.user.id) {
                    return res.status(403).json({ message: "Owners can only update bookings for their own business." });
                }
            }

            const updatedBooking = await Booking.update(
                { booking_time: booking_time, duration: duration },
                { where: { id: bookingId } }
            );

            if (updatedBooking[0] === 0) {
                throw new Error('No changes made to the booking.');
            }
            res.status(200).json({ message: 'Booking updated successfully.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }],

    // Delete a booking
    deleteBooking: [ensureAuthenticated, async (req, res) => {
        try {
            const { bookingId } = req.params;
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }
            // Allow admins to delete any booking
            if (req.user.role === 'admin') {
                await Booking.destroy({ where: { id: bookingId } });
                return res.status(200).json({ message: 'Booking deleted successfully.' });
            }
            // Check if the user is allowed to delete the booking
            if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
                return res.status(403).json({ message: "Customers can only delete their own bookings." });
            }

            if (req.user.role === 'owner') {
                const service = await Service.findByPk(booking.service_id);
                const business = await Business.findByPk(service.business_id);
                if (business.owner_id !== req.user.id) {
                    return res.status(403).json({ message: "Owners can only delete bookings for their own business." });
                }
            }

            await Booking.destroy({ where: { id: bookingId } });
            res.status(200).json({ message: 'Booking deleted successfully.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }]
};


module.exports = bookingController;

