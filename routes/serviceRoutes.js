const express = require('express');
const { Service, Business } = require('../models');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator/check');
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
