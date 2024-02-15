const express = require('express');
const router = express.Router();
const { Business } = require('../models');
const { checkAuthenticated, isAuthorized } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Route to list all businesses
router.get('/', async (req, res) => {
    try {
        const businesses = await Business.findAll();
        res.render('businesses/index', { businesses });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display the form for creating a new business
router.get('/new', [checkAuthenticated, isAuthorized], (req, res) => {
    res.render('businesses/new');
});

// Route to create a new business
router.post('/', [checkAuthenticated, isAuthorized], [
    body('name').notEmpty().withMessage('Business name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    // Add more validation as needed
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.render('businesses/new', { errors: errors.array(), business: req.body });
    }

    try {
        await Business.create(req.body);
        req.flash('success_msg', 'Business created successfully');
        res.redirect('/businesses');
    } catch (error) {
        console.error('Error creating business:', error);
        req.flash('error_msg', 'Error creating business');
        res.redirect('/businesses/new');
    }
});

// Route to view a single business by ID
router.get('/:id', async (req, res) => {
    try {
        const business = await Business.findByPk(req.params.id);
        if (business) {
            res.render('businesses/show', { business });
        } else {
            res.status(404).send('Business Not Found');
        }
    } catch (error) {
        console.error('Error fetching business:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id/edit', [checkAuthenticated, isAuthorized], async (req, res) => {
    try {
        const business = await Business.findByPk(req.params.id);
        if (!business) {
            req.flash('error_msg', 'Business not found');
            return res.redirect('/businesses');
        }
        res.render('businesses/edit', { business });
    } catch (error) {
        console.error('Error fetching business for edit:', error);
        req.flash('error_msg', 'Error loading business edit form');
        res.redirect('/businesses');
    }
});



router.put('/:id', [checkAuthenticated, isAuthorized], [
    body('name').notEmpty().withMessage('Business name is required'),
    body('description').notEmpty().withMessage('Description is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('businesses/edit', { errors: errors.array(), business: req.body, id: req.params.id });
    }

    try {
        await Business.update(req.body, { where: { id: req.params.id } });
        req.flash('success_msg', 'Business updated successfully');
        res.redirect('/businesses/' + req.params.id);
    } catch (error) {
        console.error('Error updating business:', error);
        req.flash('error_msg', 'Error updating business');
        res.redirect('/businesses/' + req.params.id + '/edit');
    }
});


router.delete('/:id', [checkAuthenticated, isAuthorized], async (req, res) => {
    try {
        await Business.destroy({ where: { id: req.params.id } });
        req.flash('success_msg', 'Business deleted successfully');
        res.redirect('/businesses');
    } catch (error) {
        console.error('Error deleting business:', error);
        req.flash('error_msg', 'Error deleting business');
        res.redirect('/businesses');
    }
});



// Additional routes (update, delete) go here


module.exports = router;
