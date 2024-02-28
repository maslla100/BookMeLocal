const { Booking } = require('../models/index');

const calendarController = {

    getEvents: async (req, res) => {
        console.log('getEvents function called');
        try {
            const events = await Booking.findAll();
            const formattedEvents = events.map(event => ({
                id: event.id,
                title: event.title,
                start: event.startDate,
                end: event.endDate,
            }));
            res.json(formattedEvents);
        } catch (error) {
            console.error('Error in getEvents:', error);
            res.status(500).json({ message: 'Error fetching events', error: error });
        }
    },

    createEvent: async (req, res) => {
        console.log('createEvent function called');
        try {
            const newEvent = await Booking.create({
                title: req.body.title,
                startDate: req.body.start,
                endDate: req.body.end,
            });
            res.status(201).json(newEvent);
        } catch (error) {
            console.error('Error in createEvent:', error);
            res.status(500).json({ message: 'Error creating new event', error: error });
        }
    },

    updateEvent: async (req, res) => {
        console.log('updateEvent function called');
        try {
            const updatedEvent = await Booking.update({
                title: req.body.title,
                startDate: req.body.start,
                endDate: req.body.end,
            }, {
                where: { id: req.params.id }
            });
            res.json({ message: 'Event updated successfully', event: updatedEvent });
        } catch (error) {
            console.error('Error in updateEvent:', error);
            res.status(500).json({ message: 'Error updating event', error: error });
        }
    },

    deleteEvent: async (req, res) => {
        console.log('deleteEvent function called');
        try {
            await Booking.destroy({
                where: { id: req.params.id }
            });
            res.json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error('Error in deleteEvent:', error);
            res.status(500).json({ message: 'Error deleting event', error: error });
        }
    },
};

module.exports = calendarController;
