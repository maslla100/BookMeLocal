const db = require('../models');
const { validationResult } = require('express-validator');
const { editBusinessValidationRules } = require('../middleware/validationRules');
const { ensureAuthenticated, ensureOwner } = require('../middleware/authMiddleware');

const ownerController = {
    showDashboard: [ensureAuthenticated, ensureOwner, async (req, res, next) => {
        try {
            console.log("showDashboard: Starting");
            const ownerId = req.user.id;
            console.log("showDashboard: Owner ID", ownerId);
            const business = await db.Business.findOne({ where: { owner_id: ownerId } });

            if (!business) {
                console.log("showDashboard: Business not found for owner", ownerId);
                return res.status(404).send("Business not found");
            }

            const bookings = await db.Booking.findAll({ where: { business_id: business.id } });
            console.log("showDashboard: Found bookings", bookings.length);
            res.render('owner/ownerDashboard', { business, bookings });
        } catch (error) {
            console.error("showDashboard: Error", error);
            next(error);
        }
    }],







    updateBusiness: [
        ensureAuthenticated,
        ensureOwner,
        editBusinessValidationRules(),
        async (req, res) => {
            console.log("updateBusiness: Starting");
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log("updateBusiness: Validation errors", errors.array());
                return res.status(400).render('owner/updateBusinessProfile', {
                    errors: errors.array(),
                    inputValues: req.body,
                    business: await db.Business.findOne({ where: { owner_id: req.user.id } })
                });
            }
            try {
                const ownerId = req.user.id;
                const { name, description, hours } = req.body;
                console.log("updateBusiness: Updating business for owner", ownerId);

                const business = await db.Business.findOne({ where: { owner_id: ownerId } });
                await business.update({ name, description, hours });

                console.log("updateBusiness: Update successful");
                res.redirect('/owner/ownerDashboard');
            } catch (error) {
                console.error("updateBusiness: Error updating business", error);
                res.status(500).redirect('/owner/ownerDashboard');
            }
        }]
};

module.exports = ownerController;
