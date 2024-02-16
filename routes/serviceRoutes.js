const express = require('express');
const { Service, Business } = require('../models');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [Business] // Include the business details
        });
        res.render('services/list', { services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id, {
            include: [Business]
        });
        if (!service) {
            res.status(404).send('Service Not Found');
            return;
        }
        res.render('services/show', { service });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Display form
router.get('/new', checkAuthenticated, (req, res) => {
    res.render('services/new');
});

// Handle form submission
router.post('/', [
    checkAuthenticated,
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('price').isDecimal({ min: 0.01 }).withMessage('Price must be a positive number'),
    // Add additional validation as needed
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('services/new', { errors: errors.array(), service: req.body });
    }

    try {
        await Service.create(req.body);
        req.flash('success_msg', 'Service added successfully');
        res.redirect('/services');
    } catch (error) {
        console.error('Error adding service:', error);
        req.flash('error_msg', 'Error adding service');
        res.redirect('/services/new');
    }
});


module.exports = router;
