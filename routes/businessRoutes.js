const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const servicesController = require('../controllers/servicesController');
//const { ensureAuthenticated, ensureAdmin, ensureAdminOrOwner } = require('../middleware/authMiddleware');

// Route to list all businesses - Accessible by authenticated users
//router.get('/list', [ensureAuthenticated], businessController.listBusinesses);
router.get('/listBusiness', businessController.listBusinesses);

// Route to view a specific business - Accessible by admins and owners
//router.get('/view/:businessId', [ensureAuthenticated, ensureAdminOrOwner], businessController.viewBusinessDetails);
router.get('/view/:businessId', businessController.viewBusinessDetails);

// Route to create a new business - Accessible by admins
//router.post('/create', [ensureAuthenticated, ensureAdmin], businessController.createBusiness);
router.post('/create', businessController.createBusiness);

// Route to update business details - Accessible by the specific business owner or admins
//router.put('/update/:businessId', [ensureAuthenticated, ensureAdminOrOwner], businessController.updateBusinessDetails);
router.put('/update/:businessId', businessController.updateBusinessDetails);


// Route to delete a business - Accessible by admins
//router.delete('/delete/:businessId', [ensureAuthenticated, ensureAdminOrOwner], businessController.deleteBusiness);
router.delete('/delete/:businessId', businessController.deleteBusiness);


// Route to manage services within a business - Accessible by the specific business owner or admins
//router.get('/manage-services/:businessId', [ensureAuthenticated, ensureAdminOrOwner], servicesController.editService);
//router.get('/manage-services/:businessId', servicesController.editService);

module.exports = router;

