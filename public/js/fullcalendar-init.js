document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");


    var calendarEl = document.getElementById('calendar');
    console.log("Calendar Element:", calendarEl);

    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next,today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        initialDate: new Date().toISOString().split('T')[0], // Today's date
        navLinks: true,
        businessHours: true,
        editable: true,
        selectable: true,
        eventSources: [{
            url: 'customer/events',
            method: 'GET',
            failure: function () {
                alert('There was an error while fetching events!');
            },
            success: function (content) {
                console.log('Events:', content);
            }
        }],
        select: function (selectionInfo) {
            // Populate start and end date fields
            $('#start_date').val(moment(selectionInfo.start).format('YYYY-MM-DD'));
            $('#end_date').val(moment(selectionInfo.end).format('YYYY-MM-DD'));

            // Reset other fields
            $('#event_name').val('');
            $('#color').val('#000000');
            $('#link').val('');

            // Show the modal for adding event
            $('#AddEvent').modal('show');
        },
        eventClick: function (eventClickInfo) {
            // Set an identifier for the event (e.g., in a hidden input)
            $('#eventId').val(eventClickInfo.event.id);
            // Populate the modal with event data
            $('#event_name').val(eventClickInfo.event.title);
            $('#start_date').val(moment(eventClickInfo.event.start).format('YYYY-MM-DD'));
            $('#end_date').val(moment(eventClickInfo.event.end).format('YYYY-MM-DD'));
            $('#color').val(eventClickInfo.event.backgroundColor);
            $('#link').val(eventClickInfo.event.url);
            $('#DeleteEvent').show(); // Show the delete button
            // Show the modal for editing event
            $('#AddEvent').modal('show');
            $('#EditEventModal').modal('show');
        }
    });

    calendar.render();


    // When the event creation form is submitted
    $('#SubmitEvent').on('submit', function (e) {
        e.preventDefault();
        // Example validation for the 'event_name' field
        if ($('#event_name').val().trim() === '') {
            alert('Event name is required.');
            $('#event_name').focus(); // Focus on the field to prompt the user
            return; // Prevent the form from being submitted
        }

        // If validation passes, proceed with the AJAX request
        $.ajax({
            type: "POST",
            url: "customer/events",
            data: $(this).serialize(),
            dataType: "json",
            success: function (response) {
                alert(response.message); // Assuming the response object has a message property
                $('#SubmitEvent').trigger("reset"); // Reset the form after successful submission               
                // Refresh the calendar view to show the new event
                calendar.refetchEvents();
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('Error creating event:', error);
                alert('Failed to create event. Please try again.'); // Provide a user-friendly error message
            }
        });
    });



    // When the event update form is submitted
    $('#UpdateEventForm').on('submit', function (e) {
        e.preventDefault();

        // Correctly declaring eventId outside the AJAX request object
        var eventId = $('#eventId').val(); // Make sure this ID is populated when the edit form is opened

        // AJAX PATCH request to update the event
        $.ajax({
            type: "PATCH",
            url: "customer/events/" + eventId, // Use the eventId in the URL
            data: $(this).serialize(),
            dataType: "json",
            success: function (response) {
                // Assuming 'response' contains 'start', 'end', and 'message'
                $('#start_date').val(moment(response.start).format('YYYY-MM-DD'));
                $('#end_date').val(moment(response.end).format('YYYY-MM-DD'));
                alert(response.message); // Show success message
                $('#AddEvent').modal('hide'); // Close the modal after successful update
                calendar.refetchEvents(); // Refresh the calendar view to show the updated event
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('Error updating event:', error);
                alert('Failed to update event. Please try again.'); // Provide a user-friendly error message
            }
        });
    });

    // Delete button click event handler
    $('#DeleteEvent').on('click', function () {
        var eventId = $('#eventId').val();
        if (eventId) {
            // AJAX DELETE request
            $.ajax({
                type: "DELETE",
                url: "customer/events/" + eventId, // Append the eventId to the URL
                success: function (response) { // Assuming the server sends back a JSON response with a message
                    alert(response.message); // Notify the user of successful deletion
                    $('#EditEventModal').modal('hide'); // Close the edit modal
                    calendar.refetchEvents(); // Refresh the calendar to reflect the deletion
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting event:', error);
                    alert('Failed to delete event. Please try again.');
                }
            });
        } else {
            alert("Event ID is missing."); // In case the eventId is not found
        }
    });



    //load Business data on to calendar drop down
    $.ajax({
        url: 'customer/business',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            populateBusinessDropdown(data);
        },
        error: function () {
            console.error('Error fetching businesses from init.js');
        }
    });

    //load service data on to calendar drop down
    $.ajax({
        url: 'customer/service',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            populateServiceDropdown(data);
        },
        error: function () {
            console.error('Error fetching services from init.js');
        }
    });

});

function populateBusinessDropdown(businesses) {
    var businessDropdown = $('#business_name');
    businesses.forEach(function (business) {
        businessDropdown.append(new Option(business.name, business.id));
    });
    businessDropdown.change(function () {
        var selectedBusinessId = $(this).val();
        fetchServicesForBusiness(selectedBusinessId);

    }
    )
};


function populateServiceDropdown(services) {
    var serviceDropdown = $('#service_name');
    serviceDropdown.empty();
    services.forEach(function (service) {
        serviceDropdown.append(new Option(service.name, service.id));
    });
};


function fetchServicesForBusiness(businessId) {
    $.ajax({
        url: `customer/service?businessId=${encodeURIComponent(businessId)}`,
        method: 'GET',
        dataType: 'json',
        success: function (services) {

            populateServiceDropdown(services);
        },
        error: function (error) {
            console.error('Error fetching services for business ID at full calendar init:', businessId, error);
        }
    }
    )
};

