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
            let bookings = await db.Booking.findAll({
                where: { userId: customerId },
                include: [{
                    model: db.Service,
                    include: [db.Business]
                }]
            });


            // Convert Sequelize objects to plain JavaScript objects, handle bars issue!
            bookings = bookings.map(booking => booking.get({ plain: true }));

            const customer = await db.User.findByPk(customerId);
            console.log("Dashboard Data: ", { customer, bookings });
            console.log("Rendering customer dashboard");
            console.log("Bookings Data: ", bookings);

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
                viewServiceLink: '/customer/services',
                calendarLink: '/customer/calendar',
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
