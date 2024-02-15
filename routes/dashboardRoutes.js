const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { Booking, Service, Business } = require('../models');

// Dashboard Route
router.get('/', ensureAuthenticated, async (req, res) => {
    try {

        const userId = req.session.userId;


        const bookings = await Booking.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Service,
                    include: [Business]
                }
            ]
        });

        res.render('dashboard', {
            bookings: bookings,

        });
    } catch (error) {
        console.error('Error fetching data for dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
