document.addEventListener('DOMContentLoaded', function() {
    var citySelect = document.getElementById('city');
    var weightInput = document.getElementById('weight');
    var calculateBtn = document.getElementById('calculateBtn');
    var resultDiv = document.getElementById('result');
    var errorDiv = document.getElementById('error');
    var resultText = document.querySelector('.result-text');
    var errorText = document.querySelector('.error-text');

    function loadCities() {
        fetch('/api/cities')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.cities) {
                    for (var i = 0; i < data.cities.length; i++) {
                        var city = data.cities[i];
                        var option = document.createElement('option');
                        option.value = city.name;
                        option.textContent = city.name + ' (' + city.temperature + 'C)';
                        citySelect.appendChild(option);
                    }
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
    }

    function showResult(data) {
        var normLiters = data.data.recommended_norm_liters;
        var city = data.data.city;
        var temperature = data.data.temperature;
        var weight = data.data.weight;

        resultText.innerHTML = 'Recommended: ' + normLiters + ' liters<br>' +
            'City: ' + city + ' (' + temperature + 'C)<br>' +
            'Weight: ' + weight + ' kg';

        resultDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
    }

    function showError(message) {
        errorText.innerHTML = 'Error: ' + message;
        errorDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
    }

    function calculateNorm() {
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        var city = citySelect.value;
        var weight = parseFloat(weightInput.value);

        if (!city) {
            showError('Please select a city');
            return;
        }

        if (weightInput.value === '') {
            showError('Please enter weight');
            return;
        }

        if (isNaN(weight)) {
            showError('Weight must be a number');
            return;
        }

        fetch('/api/water-norm/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: city, weight: weight })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                showResult(data);
            } else {
                showError(data.error);
            }
        })
        .catch(function(error) {
            showError('Connection error');
        });
    }

    calculateBtn.addEventListener('click', calculateNorm);
    loadCities();
});