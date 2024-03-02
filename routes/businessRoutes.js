const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const servicesController = require('../controllers/servicesController');
const { ensureAuthenticated, ensureAdmin, ensureAdminOrOwner } = require('../middleware/authMiddleware');

// Route to list all businesses - Accessible by authenticated users
router.get('/list', [ensureAuthenticated], businessController.listBusinesses);

// Route to view a specific business - Accessible by admins and owners
router.get('/view/:businessId', [ensureAuthenticated, ensureAdminOrOwner], businessController.viewBusinessDetails);

// Route to create a new business - Accessible by admins
router.post('/create', [ensureAuthenticated, ensureAdmin], businessController.createBusiness);

// Route to update business details - Accessible by the specific business owner or admins
router.put('/update/:businessId', [ensureAuthenticated, ensureAdminOrOwner], businessController.updateBusinessDetails);


// Route to delete a business - Accessible by admins
router.delete('/delete/:businessId', [ensureAuthenticated, ensureAdminOrOwner], businessController.deleteBusiness);


// Route to manage services within a business - Accessible by the specific business owner or admins
router.get('/manage-services/:businessId', [ensureAuthenticated, ensureAdminOrOwner], servicesController.editService);

module.exports = router;

