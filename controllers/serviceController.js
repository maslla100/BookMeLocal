const { Service, Business } = require('../models');
const { validationResult } = require('express-validator');

exports.listServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [Business]
        });
        res.render('services/list', { services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showService = async (req, res) => {
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
};

exports.showNewServiceForm = (req, res) => {
    res.render('services/new');
};

exports.createService = async (req, res) => {
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
};
