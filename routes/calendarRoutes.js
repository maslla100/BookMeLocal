const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { Booking } = require('../models/index');



// Fetch events
router.get('/events', ensureAuthenticated, calendarController.getEvents);

// Create a new event
router.post('/events', ensureAuthenticated, calendarController.createEvent);

// Update an event
router.put('/events/:id', ensureAuthenticated, calendarController.updateEvent);

// Delete an event
router.delete('/events/:id', ensureAuthenticated, calendarController.deleteEvent);






module.exports = router;

