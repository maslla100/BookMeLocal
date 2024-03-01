const { Booking, User, Service, Business } = require('../models/index');

const calendarController = {


    createEvent: async (req, res) => {
        console.log('createEvent function called');
        try {
            console.log("Received request body:", req.body);
            const { event_name, start_date, start_time, end_date, end_time, service_name } = req.body;

            let missingDetails = [];
            if (!event_name) missingDetails.push("event_name");
            if (!start_date) missingDetails.push("start_date");
            if (!start_time) missingDetails.push("start_time");
            if (!end_date) missingDetails.push("end_date");
            if (!end_time) missingDetails.push("end_time");
            if (!service_name) missingDetails.push("service_name");

            if (missingDetails.length > 0) {
                console.log("Missing required event details:", missingDetails.join(", "));
                return res.status(400).json({ message: `Missing required event details: ${missingDetails.join(", ")}` });
            }

            // Assuming `service_name` is your `serviceId`
            const serviceId = service_name; // Adjust based on your actual field

            // Check for missing required event details
            if (!event_name || !start_date || !start_time || !end_date || !end_time || !serviceId) {
                console.log("Missing required event details");
                return res.status(400).json({ message: "Missing required event details" });
            }

            // Find the service and include the related business for further validation
            const service = await Service.findByPk(serviceId, {
                include: [{ model: Business, as: 'Business' }]
            });

            if (!service) {
                return res.status(404).json({ message: "Service not found" });
            }

            // For owners, check if the service belongs to one of their businesses
            if (req.user.role === 'owner' && service.Business.ownerId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to create event for this service." });
            }

            // Calculate duration
            const duration = calculateDuration(start_date, start_time, end_date, end_time);

            let newBookingData = {
                userId: req.user.id,
                service_id: serviceId, // Corrected to match the Sequelize model expectation
                booking_time: new Date(`${start_date}T${start_time}`),
                duration: duration
            };

            const newBooking = await Booking.create(newBookingData);
            console.log('New booking created:', newBooking);

            res.status(201).json({
                message: "Booking successfully created",
                booking: {
                    id: newBooking.id,
                    service: service.name,
                    business: service.Business.name,
                    bookingTime: newBooking.booking_time,
                    duration: newBooking.duration
                }
            });
        } catch (error) {
            console.error('Error in createEvent:', error);
            res.status(500).json({ message: 'Error creating new event', error: error.toString() });
        }
    },







    getEvents: async (req, res) => {
        console.log('getEvents function called');
        try {
            let queryOptions = {};
            if (req.user.role === 'customer') {
                queryOptions.where = { userId: req.user.id };
                queryOptions.include = [{
                    model: Service,
                    attributes: ['name'], // Include service name
                    include: [{
                        model: Business,
                        attributes: ['name'] // Include business name
                    }]
                }];
            } else if (req.user.role === 'owner') {
                queryOptions.include = [{
                    model: Service,
                    attributes: ['name'], // Include service name
                    include: [{
                        model: Business,
                        where: { ownerId: req.user.id },
                        attributes: ['name'] // Include business name
                    }]
                }];
            }

            const bookings = await Booking.findAll(queryOptions);
            console.log("Fetched bookings:", bookings);

            const formattedEvents = bookings.map(booking => {
                const service = booking.Service;
                const business = service.Business;
                const start = new Date(booking.booking_time);
                const end = new Date(start.getTime() + booking.duration * 60000);

                return {
                    id: booking.id,
                    title: `${service.name} at ${business.name}`,
                    start: start.toISOString(),
                    end: end.toISOString(),
                    duration: booking.duration
                };
            });

            res.json(formattedEvents);
        } catch (error) {
            console.error('Error in getEvents:', error);
            res.status(500).json({ message: 'Error fetching events', error: error });
        }
    },

    updateEvent: async (req, res) => {
        console.log('updateEvent function called');
        try {
            const eventId = req.params.id;

            // Retrieve the booking to check ownership and related service
            const booking = await Booking.findByPk(eventId, {
                include: [{
                    model: Service,
                    include: [Business]
                }]
            });

            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }

            // Check user permissions based on their role
            if (req.user.role === 'customer' && booking.userId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to update this booking." });
            }

            if (req.user.role === 'owner' && booking.Service.Business.ownerId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to update this booking." });
            }

            // Extract updated booking details from request body
            const { event_name, start_date, start_time, end_date, end_time, serviceId, color, link } = req.body;

            // Validate input details
            let missingDetails = [];
            if (!event_name) missingDetails.push("event_name");
            if (!start_date || !start_time) missingDetails.push("start_date/start_time");
            if (!end_date || !end_time) missingDetails.push("end_date/end_time");
            // Assuming serviceId is required; adjust according to your application's logic
            if (!serviceId) missingDetails.push("serviceId");

            if (missingDetails.length > 0) {
                console.log("Missing required event details:", missingDetails.join(", "));
                return res.status(400).json({ message: `Missing required event details: ${missingDetails.join(", ")}` });
            }

            // Calculate duration if needed, based on start and end times/dates
            // Assuming you have a function to calculate this, similar to the client side

            // Update the booking if the user is authorized
            const bookingTime = new Date(`${start_date}T${start_time}`);
            const duration = calculateDuration(start_date, start_time, end_date, end_time);

            const updateData = {
                // Assuming these fields exist in your Booking model
                booking_time: bookingTime,
                duration: duration,
                // Include other fields to be updated
            };

            const updated = await Booking.update(updateData, {
                where: { id: eventId }
            });

            if (updated[0] === 0) {
                throw new Error('No updates made to the booking.');
            }

            res.json({ message: 'Booking updated successfully', booking: updated });
        } catch (error) {
            console.error('Error in updateEvent:', error);
            res.status(500).json({ message: 'Error updating booking', error: error.toString() });
        }
    },



    deleteEvent: async (req, res) => {
        console.log('deleteEvent function called');
        try {
            const bookingId = req.params.id;

            // Retrieve the booking to check permissions
            const booking = await Booking.findByPk(bookingId, {
                include: [{
                    model: Service,
                    include: [Business]
                }]
            });

            if (!booking) {
                return res.status(404).json({ message: "Booking not found." });
            }

            // Check user permissions based on their role
            if (req.user.role === 'customer' && booking.userId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to delete this booking." });
            }

            if (req.user.role === 'owner' && booking.Service.Business.ownerId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to delete this booking." });
            }

            // If the user is authorized, delete the booking
            await Booking.destroy({
                where: { id: bookingId }
            });

            res.json({ message: 'Booking deleted successfully', bookingId: bookingId });
        } catch (error) {
            console.error('Error in deleteEvent:', error);
            res.status(500).json({ message: 'Error deleting booking', error: error });
        }
    },
};

// Function to calculate duration moved outside to be accessible by createEvent
function calculateDuration(start_date, start_time, end_date, end_time) {
    const start = new Date(`${start_date}T${start_time}`);
    const end = new Date(`${end_date}T${end_time}`);
    return (end - start) / (1000 * 60 * 60); // Duration in hours
}

module.exports = calendarController;
