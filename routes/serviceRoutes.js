

const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const servicesController = require('../controllers/servicesController');

router.get('/', servicesController.listServices);
router.get('/:id', servicesController.showService);
router.get('/new', checkAuthenticated, servicesController.showNewServiceForm);
router.post('/', [
    checkAuthenticated,
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('price').isDecimal({ min: 0.01 }).withMessage('Price must be a positive number')
], servicesController.createService);

module.exports = router;
