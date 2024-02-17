const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { checkAuthenticated, isAuthorized } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.get('/', businessController.listBusinesses);
router.get('/new', [checkAuthenticated, isAuthorized], businessController.showNewBusinessForm);
router.post('/', [checkAuthenticated, isAuthorized], [
    body('name').notEmpty().withMessage('Business name is required'),
    body('description').notEmpty().withMessage('Description is required'),
], businessController.createBusiness);
router.get('/:id', businessController.showBusiness);
router.get('/:id/edit', [checkAuthenticated, isAuthorized], businessController.showEditBusinessForm);
router.put('/:id', [checkAuthenticated, isAuthorized], [
    body('name').notEmpty().withMessage('Business name is required'),
    body('description').notEmpty().withMessage('Description is required'),
], businessController.updateBusiness);
router.delete('/:id', [checkAuthenticated, isAuthorized], businessController.deleteBusiness);

module.exports = router;
