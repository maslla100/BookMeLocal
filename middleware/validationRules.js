const { body } = require('express-validator');

// Empty validation rules for testing
const noValidationRules = () => {
    return [];
};


const userValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').isIn(['admin', 'owner', 'customer']).withMessage('Invalid role specified')
    ];
};

const businessValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Business name is required'),
        body('description').notEmpty().withMessage('Business description is required'),
        body('hours').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][Mm] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][Mm]$/).withMessage('Business hours must be in the format "HH:MM AM/PM - HH:MM AM/PM"'),
        // Add more rules as necessary
    ];
};


const serviceValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Service name is required'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('description').optional().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
        // Add more rules as necessary
    ];
};


const bookingValidationRules = () => {
    return [
        body('serviceId').isInt().withMessage('Service ID must be an integer'),
        body('userId').isInt().withMessage('User ID must be an integer'),
        body('bookingTime').isISO8601().withMessage('Invalid booking time format'),
        body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer')
    ];
};


const editUserValidationRules = () => {
    return [
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('role').optional().isIn(['admin', 'owner', 'customer']).withMessage('Invalid role specified')
        // Password is typically not updated via a standard edit operation
    ];
};

const editBusinessValidationRules = () => {
    return [
        body('name').optional().notEmpty().withMessage('Business name is required'),
        body('description').optional().notEmpty().withMessage('Business description is required'),
        // Add more rules as necessary, make sure they are optional
    ];
};

const editServiceValidationRules = () => {
    return [
        body('name').optional().notEmpty().withMessage('Service name is required'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        // Add more rules as necessary, make sure they are optional
    ];
};

const editBookingValidationRules = () => {
    return [
        body('serviceId').optional().isInt().withMessage('Service ID must be an integer'),
        body('userId').optional().isInt().withMessage('User ID must be an integer'),
        body('bookingTime').optional().isISO8601().withMessage('Invalid booking time format'),
        body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer')
    ];
};

module.exports = {
    userValidationRules,
    editUserValidationRules,
    businessValidationRules,
    editBusinessValidationRules,
    serviceValidationRules,
    editServiceValidationRules,
    bookingValidationRules,
    editBookingValidationRules
    // Add other exported rules as necessary
};

