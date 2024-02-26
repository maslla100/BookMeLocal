const { Service, Business } = require('../models');
const { validationResult } = require('express-validator');
const { ensureAuthenticated, ensureAdmin, ensureOwner } = require('../middleware/authMiddleware');
const {
    serviceValidationRules,
    editServiceValidationRules
} = require('../middleware/validationRules');
//const { ErrorHandler, handleError } = require('../middleware/errorHandler');

const servicesController = {

    // List all services - Accessible to admins, owners and customers
    listServices: [ensureAuthenticated, async (req, res) => {
        try {
            let services = await Service.findAll();
            // Convert each Sequelize object to a plain JavaScript object
            services = services.map(service => service.get({ plain: true }));
            console.log("Converted Services: ", services); // Debugging
            res.render('services/listServices', { services });
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to retrieve services'), res);
        }
    }],


    // Create a new service - Accessible to admins and owners
    createService: [ensureAuthenticated, ensureAdmin, serviceValidationRules(), async (req, res) => {
        // Add conditional check for owner access
        if (!req.user.isAdmin && !req.user.isOwner) {
            return res.status(403).send('Unauthorized');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, description, price, business_id } = req.body;
            const newService = await Service.create({ name, description, price, business_id });
            res.json(newService);
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to create service'), res);
        }
    }],

    // Edit a service - Accessible to admins and owners
    editService: [ensureAuthenticated, ensureAdmin, editServiceValidationRules(), async (req, res) => {
        // Add conditional check for owner access
        if (!req.user.isAdmin && !req.user.isOwner) {
            return res.status(403).send('Unauthorized');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const { name, description, price } = req.body;
            const updatedService = await Service.update({ name, description, price }, { where: { id } });
            res.json(updatedService);
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to edit service'), res);
        }
    }],

    // Delete a service - Accessible to admins and owners
    deleteService: [ensureAuthenticated, ensureAdmin, async (req, res) => {
        // Add conditional check for owner access
        if (!req.user.isAdmin && !req.user.isOwner) {
            return res.status(403).send('Unauthorized');
        }

        try {
            const { id } = req.params;
            await Service.destroy({ where: { id } });
            res.send('Service deleted successfully');
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to delete service'), res);
        }
    }],

    // List services for a specific business - Accessible to all authenticated users
    listServicesForBusiness: [ensureAuthenticated, async (req, res) => {
        try {
            const business = await Business.findByPk(req.params.businessId);
            if (!business) {
                return handleError(new ErrorHandler(404, 'Business not found'), res);
            }
            const services = await Service.findAll({ where: { business_id: req.params.businessId } });
            res.json(services);
        } catch (error) {
            handleError(new ErrorHandler(500, error.message), res);
        }
    }],
};

module.exports = servicesController;
