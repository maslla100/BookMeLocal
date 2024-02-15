

const { Business } = require('../models');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

// Add this new function to check for authorization
async function isAuthorized(req, res, next) {
    try {
        const businessId = req.params.id;
        const business = await Business.findByPk(businessId);


        if (business && req.user.id === business.ownerId) {
            return next();
        } else {
            req.flash('error_msg', 'You are not authorized to perform this action.');
            return res.redirect('/businesses');
        }
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    isAuthorized
};
