document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'timeGrid', 'interaction'],
        editable: true,
        eventLimit: true, // for all non-agenda views
        // Add more options as needed
    });

    calendar.render();
});
