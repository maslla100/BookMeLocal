const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { check, validationResult } = require('express-validator');

// Register route with input validation
router.post('/register', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).render('register', { errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        req.flash('success_msg', 'You are now registered and can log in');
        req.session.userId = newUser.id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Login route with basic input validation
router.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).render('login', { errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error_msg', 'Incorrect email or password');
            return res.redirect('/login');
        }

        req.session.userId = user.id;
        req.flash('success_msg', 'You are now logged in');
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        req.flash('success_msg', 'You have been logged out');
        res.redirect('/');
    });
});

module.exports = router;
