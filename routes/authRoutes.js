// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Register route
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            email: req.body.email,
            password: hashedPassword,
        });
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Login route
router.post('/login', async (req, res) => {
    // Implement login logic
});

module.exports = router;
