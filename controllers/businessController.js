
const { Business, Service } = require('../models/index');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const { ensureAuthenticated, ensureAdmin, ensureAdminOrOwner } = require('../middleware/authMiddleware');
const { validationResult } = require('express-validator');
const {
    businessValidationRules,
    editBusinessValidationRules
} = require('../middleware/validationRules');

const businessController = {
    // List all businesses - Accessible to all authenticated users
    listBusinesses: [ensureAuthenticated, async (req, res) => {
        console.log("listBusinesses called");
        try {
            let businesses = await Business.findAll();
            // Convert each Sequelize model instance to a plain object
            businesses = businesses.map(business => business.get({ plain: true }));
            console.log("Converted businesses:", businesses); // Log the converted data
            res.render('business/listBusiness', { businesses });
        } catch (error) {
            console.error("Error in listBusinesses:", error);
            req.flash('error', 'An error occurred while fetching businesses.');
            res.redirect('/some-error-page');
        }
    }],



    // View details of a specific business - Accessible to all authenticated users
    viewBusinessDetails: [ensureAuthenticated, async (req, res) => {
        try {
            const business = await Business.findByPk(req.params.id, {
                include: [Service]
            });
            if (!business) {
                return handleError(new ErrorHandler(404, 'Business not found'), res);
            }
            res.json(business);
        } catch (error) {
            handleError(new ErrorHandler(500, error.message), res);
        }
    }],

    // Create a new business (Admin-specific) with validation
    createBusiness: [ensureAuthenticated, ensureAdmin, businessValidationRules(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newBusiness = await Business.create(req.body);
            res.status(201).json(newBusiness);
        } catch (error) {
            handleError(new ErrorHandler(500, error.message), res);
        }
    }],


    // Update business details (Owner-specific) with validation
    updateBusinessDetails: [ensureAuthenticated, ensureAdminOrOwner, editBusinessValidationRules(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const business = await Business.findByPk(req.params.id);
            if (!business) {
                return handleError(new ErrorHandler(404, 'Business not found'), res);
            }
            // Check if the logged-in user is the owner of the business
            if (business.owner_id !== req.user.id) {
                return handleError(new ErrorHandler(403, 'Unauthorized to update this business'), res);
            }

            const [updated] = await Business.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return handleError(new ErrorHandler(404, 'No updates made or business not found'), res);
            }

            res.json({ message: 'Business updated successfully.' });

        } catch (error) {
            handleError(new ErrorHandler(500, error.message), res);
        }
    }],

    // Delete a business (Admin-specific)
    deleteBusiness: [ensureAuthenticated, ensureAdmin, async (req, res) => {
        try {
            const business = await Business.findByPk(req.params.id);
            if (!business) {
                return handleError(new ErrorHandler(404, 'Business not found'), res);
            }
            // Admins can delete any business, owners can only delete their own
            if (req.user.role !== 'admin' && business.owner_id !== req.user.id) {
                return handleError(new ErrorHandler(403, 'Unauthorized to delete this business'), res);
            }

            await Business.destroy({ where: { id: req.params.id } });
            res.status(200).json({ message: 'Business deleted successfully' });
        } catch (error) {
            handleError(new ErrorHandler(500, error.message), res);
        }
    }],

};

module.exports = businessController;



