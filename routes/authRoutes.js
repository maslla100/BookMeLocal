const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register POST route
router.post('/register', ...authController.register);

// Register GET route for Rendering the Register Page 
router.get('/register', (req, res) => {
    console.log("GET /register route accessed authRoutes");
    res.render('auth/register');
});

// Login POST route
router.post('/login', (req, res, next) => {
    console.log("POST /login route accessed authRoutes");
    return authController.login(req, res, next);
});

// Login GET route for Rendering the Login Page 
router.get('/login', (req, res) => {
    console.log("GET /login route accessed on authRoutes");
    res.render('auth/login', { messages: req.flash('error') });
});

// Logout route
router.get('/logout', (req, res, next) => {
    console.log("GET /logout route accessed");
    return authController.logout(req, res, next);
});



module.exports = router;
