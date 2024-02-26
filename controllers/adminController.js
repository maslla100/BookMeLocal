const { User, Booking, Business, Service } = require('../models'); // Make sure to import all needed models
//const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');
const { userValidationRules, editUserValidationRules } = require('../middleware/validationRules');
const bcryptjs = require('bcryptjs');
const saltRounds = 8;

const adminController = {
    showDashboard: [ensureAuthenticated, ensureAdmin, async (req, res) => {
        try {
            const [userCount, bookingCount, businessCount, serviceCount] = await Promise.all([
                User.count(),
                Booking.count(),
                Business.count(),
                Service.count()
            ]);

            const links = {
                manageBookings: '/admin/manageBookings',
                manageBusiness: '/admin/manageBusiness',
                manageServices: '/admin/manageServices',
                manageUsers: '/admin/manageUsers',
                createBusiness: '/admin/createBusiness'
            };

            res.render('admin/adminDashboard', {
                userCount,
                bookingCount,
                businessCount,
                serviceCount,
                links: {
                    manageBookings: '/admin/bookings',
                    manageBusiness: '/admin/businesses',
                    manageServices: '/admin/services',
                    manageUsers: '/admin/users',
                    createBusiness: '/admin/businesses', // Assuming this uses the same route but with different method (POST)
                    // Add any additional links required}
                }
            });
        } catch (error) {
            console.error('Error in viewDashboard:', error);
            handleError(new ErrorHandler(500, 'Internal Server Error'), res);
        }
    }],

    listUsers: [ensureAuthenticated, ensureAdmin, async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json({ status: 'success', data: users, message: 'Users retrieved successfully' });
        } catch (error) {
            console.error('Error fetching users:', error);
            handleError(new ErrorHandler(500, 'Failed to retrieve users'), res);
        }
    }],

    createUser: [ensureAuthenticated, ensureAdmin, userValidationRules(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', error: errors.array() });
        }
        try {
            const { email, password, role } = req.body;
            const hashedPassword = await bcryptjs.hash(password, saltRounds);
            const newUser = await User.create({ email, password: hashedPassword, role });
            res.status(201).json({ status: 'success', data: newUser, message: 'User created successfully' }); // 201 Created
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to create user'), res);
        }
    }],

    editUser: [ensureAuthenticated, ensureAdmin, editUserValidationRules(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'error', error: errors.array() });
        }
        try {
            const { id } = req.params;
            const { email, password, role } = req.body;
            const updatedData = { email, role };
            if (password) {
                updatedData.password = await bcryptjs.hash(password, saltRounds);
            }
            const updatedUser = await User.update(updatedData, { where: { id } });
            if (updatedUser[0] > 0) {
                res.status(200).json({ status: 'success', message: 'User updated successfully' });
            } else {
                res.status(404).json({ status: 'error', message: 'User not found' }); // 404 Not Found if no user is updated
            }
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to edit user'), res);
        }
    }],

    deleteUser: [ensureAuthenticated, ensureAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const deleteCount = await User.destroy({ where: { id } });
            if (deleteCount > 0) {
                res.status(200).json({ status: 'success', message: 'User deleted successfully' });
            } else {
                res.status(404).json({ status: 'error', message: 'User not found' }); // 404 Not Found if no user is deleted
            }
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to delete user'), res);
        }
    }]
};

module.exports = adminController;
