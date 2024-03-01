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
            let services = await Service.findAll({
                include: [{
                    model: Business,
                    attributes: ['name']
                }],
                order: [['business_id', 'ASC']]
            });

            // Convert each Sequelize object to a plain JavaScript object
            services = services.map(service => service.get({ plain: true }));
            console.log("Converted Services: ", services);

            res.render('services/listServices', { services });
        } catch (error) {
            handleError(new ErrorHandler(500, 'Failed to retrieve services'), res);
        }
    }],


    // List all services no role
    listServices_norole: [ensureAuthenticated, async (req, res) => {
        const { businessId } = req.query; // Extract businessId from query parameters, if present

        const queryOptions = {
            include: [{
                model: Business,
                attributes: ['name']
            }],
            order: [['business_id', 'ASC']]
        };

        // If a businessId is provided, add a where clause to filter services by this ID
        if (businessId && !isNaN(Number(businessId))) {
            queryOptions.where = { business_id: businessId };
        }

        try {
            let services = await Service.findAll(queryOptions);

            // Convert each Sequelize object to a plain JavaScript object
            services = services.map(service => service.get({ plain: true }));
            console.log("Converted Services: ", services);

            // Adjust the response based on the expected format by the AJAX calls
            res.json(services); // Respond with JSON instead of rendering a view
        } catch (error) {
            console.error('Failed to retrieve services', error);
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
