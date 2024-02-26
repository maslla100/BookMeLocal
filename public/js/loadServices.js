document.addEventListener('DOMContentLoaded', function () {
    const businessSelect = document.getElementById('businessSelect');
    const serviceSelect = document.getElementById('serviceSelect');

    businessSelect.addEventListener('change', function () {
        const businessId = this.value;
        serviceSelect.innerHTML = '';

        fetch(`../services/${businessId}`)
            .then(response => response.json())
            .then(services => {
                services.forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.id;
                    option.textContent = service.name;
                    serviceSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading services:', error));
    });
});
