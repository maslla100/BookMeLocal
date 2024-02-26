const db = require('../models');
const { validationResult } = require('express-validator');
const validation = require('../middleware/validationRules');
const { ensureAuthenticated, ensureCustomer } = require('../middleware/authMiddleware');
const bcryptjs = require('bcryptjs');
const saltRounds = 8;


const customerController = {

    // Display Customer Dashboard
    showDashboard: [ensureAuthenticated, ensureCustomer, async (req, res) => {
        try {
            const customerId = req.user.id;
            // Retrieve customer's bookings and other necessary data
            let bookings = await db.Booking.findAll({
                where: { userId: customerId },
                include: [db.Service] // Include service details in the booking
            });

            // Convert Sequelize objects to plain JavaScript objects
            bookings = bookings.map(booking => booking.get({ plain: true }));

            const customer = await db.User.findByPk(customerId);
            console.log("Dashboard Data: ", { customer, bookings });
            // Render customer dashboard view with bookings, customer info, and dynamic links
            console.log("Rendering customer dashboard");
            res.render('customer/customerDashboard', {
                customer: customer,
                bookings: bookings,
                canCreateBooking: true,
                canEditBooking: true,
                canDeleteBooking: true,
                // Dynamic links
                profileLink: '/customer/profile',
                bookingsListLink: '/customer/bookings',
                listBusinessLink: '/customer/listBusiness',
                createBookingLink: '/customer/createbookings', // Same as list, used for POST
                viewServiceLink: '/customer/services', // Replace :id dynamically
                dashboardLink: '/customer/customerDashboard',
                logoutLink: '/auth/logout',
                // User info
                loggedIn: req.isAuthenticated(),
                isCustomer: req.user && req.user.role === 'customer',
                userName: req.user ? req.user.name : null
            });
            console.log("Dashboard rendered");

        } catch (error) {
            console.error('Error in showDashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    }],


    /*showDashboard: (req, res) => {
        console.log("showDashboard: Simplified version called");

        // Render the simple view
        res.render('customer/customerDashboard');
    },*/



    viewProfile: [ensureAuthenticated, async (req, res) => {
        try {
            const customerId = req.user.id;

            // Retrieve customer's profile information
            const customer = await db.User.findByPk(customerId);

            if (!customer) {
                return res.status(404).send('Customer not found');
            }

            // Convert the Sequelize model instance to a plain object
            const customerData = customer.toJSON();

            // Render the view profile page with customer information
            res.render('customer/viewProfile', { customer: customerData });
        } catch (error) {
            console.error('Error in viewProfile:', error);
            res.status(500).send('Internal Server Error');
        }
    }],



    // Update Customer Profile
    updateProfile: [ensureAuthenticated, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('customer/updateProfile', {
                errors: errors.array()
            });
        }

        try {
            const customerId = req.user.id;
            const { email, password } = req.body;

            // Hash the password
            const hashedPassword = await bcryptjs.hash(password, saltRounds);

            // Update customer profile
            await db.User.update({ email, password: hashedPassword }, { where: { id: customerId } });

            // Redirect to dashboard with a success message
            res.redirect('/customer/customerDashboard');
        } catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).send('Internal Server Error');
        }
    }],




    //select company to book service with
    selectCompany: [ensureAuthenticated, async (req, res) => {
        try {
            const businesses = await db.Business.findAll();

            // Render a view with a list of businesses
            res.render('customer/selectCompany', { businesses });
        } catch (error) {
            console.error('Error in selectCompany:', error);
            res.status(500).send('Internal Server Error');
        }
    }],





};


module.exports = customerController;
