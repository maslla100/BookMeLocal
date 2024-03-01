const passport = require('passport');
const { User } = require('../models');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');
const { userValidationRules, ensureAuthenticated, ensureAdmin } = require('../middleware/validationRules');
const { getDashboardUrl } = require('../utils/utils.js');

const authController = {

    register: [userValidationRules(), async (req, res) => {
        console.log("Register at auth controller function called");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors in register at authcontroller:", errors.array());
            req.flash('error', 'Validation errors: ' + errors.array().map(e => e.msg).join(', '));
            return res.redirect('/auth/login'); // Redirect back to the home page
        }

        if (req.body.role && req.body.role !== 'customer') {
            console.log("Attempted to create a non-customer account");
            req.flash('error', 'Only customer accounts can be created.');
            return res.redirect('/auth/login'); // Redirect back to the home page
        }

        try {
            const { email, password } = req.body;
            console.log("Creating user:", email);
            await User.create({ email, password, role: 'customer' });
            console.log("User created successfully, redirecting to login");
            req.flash('success', 'Registration successful. Please login.');
            res.redirect('/auth/login'); // Redirect to the login page
        } catch (error) {
            console.error("Error in register function:", error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                req.flash('error', 'Email already in use');
            } else {
                req.flash('error', 'Registration failed');
            }
            return res.redirect('auth/login'); // Redirect back to the home page
        }
    }],



    login: (req, res, next) => {
        console.log("Login function called at authController");
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error("Error in passport authenticate at authController:", err);
                return next(err);
            }
            if (!user) {
                console.log("Login failed:", info.message);
                req.flash('error', info.message || 'error', 'Invalid username or password');
                return res.redirect('/auth/login'); // Redirect to login page
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error("Error during req.logIn:", err);
                    req.flash('error', 'An error occurred during login.');
                    return res.redirect('/auth/login'); // Redirect to home page or login page after logo
                }
                console.log("Login successful at authController, user role:", user.role);
                console.log("Redirecting to at authController:", getDashboardUrl(user.role));
                return res.redirect(getDashboardUrl(user.role));
            });
        })(req, res, next);
    },



    logout: (req, res) => {
        req.logout(function (err) {
            if (err) {
                console.error('Error during logout:', err);
                return res.status(500).send('Error during logout');
            }
            console.log('Logout successful');
            res.redirect('/auth/login'); // Redirect to home page or login page after logout
        });
    }





    //Will work on this when time permits

    /*
    changeUserRole: [ensureAuthenticated, ensureAdmin, async (req, res) => {
        try {
            const { userId, newRole } = req.body;
            if (!['admin', 'owner', 'customer'].includes(newRole)) {
                return res.status(400).json({ message: 'Invalid role specified' });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.role = newRole;
            await user.save();

            res.status(200).json({ message: 'User role updated successfully', user }); // 200 OK on successful update
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to change user role'), res);
        }
    }],
*/


};



module.exports = authController;
