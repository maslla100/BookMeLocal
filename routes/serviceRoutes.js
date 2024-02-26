const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
//const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');

// Route to list all services for a specific business
//router.get('/business/:businessId/services', ensureAuthenticated, ensureRole(['owner', 'admin']), servicesController.listServices);
//router.get('/business/:businessId/services', servicesController.listServices);

// Route for owners/admins to add a new service to a business
//router.post('/business/:businessId/services/add', ensureAuthenticated, ensureRole(['owner', 'admin']), servicesController.createService);
//router.post('/business/:businessId/services/add', servicesController.createService);

// Route for owners/admins to update a specific service
//router.put('/services/:serviceId', ensureAuthenticated, ensureRole(['owner', 'admin']), servicesController.editService);
//router.put('/services/:serviceId', servicesController.editService);

// Route for owners/admins to delete a specific service
//router.delete('/services/:serviceId', ensureAuthenticated, ensureRole(['owner', 'admin']), servicesController.deleteService);
//router.delete('/services/:serviceId', servicesController.deleteService);

module.exports = router;
