const apiKey = "a7fba6c21c020f35947eb0fb6baabfc6";
const geocodingBaseUrl = "https://api.openweathermap.org/geo/1.0/direct";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const loadingElement = document.getElementById('loading');
const weatherInfo = document.getElementById('weather-info');


async function getCoordinates(cityName) {
    const url = `${geocodingBaseUrl}?q=${cityName}&limit=1&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar coordenadas. Verifique o nome da cidade.");
        const data = await response.json();
        if (data.length === 0) throw new Error("Cidade não encontrada.");
        const { lat, lon } = data[0];
        return { lat, lon };
    } catch (error) {
        throw error;
    }
}

async function getWeather(lat, lon) {
    const url = `${weatherBaseUrl}?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar o clima.");
        const data = await response.json();
        return {
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };
    } catch (error) {
        throw error;
    }
}

document.getElementById('search-button').addEventListener('click', async () => {
    const city = document.getElementById('city').value.trim();
    const weatherInfo = document.getElementById('weather-info');

    if (!city) {
        weatherInfo.innerHTML = "<p>Por favor, insira o nome de uma cidade.</p>";
        return;
    }

    loadingElement.classList.remove('hidden');
    weatherInfo.innerHTML = "";

    try {
        const { lat, lon } = await getCoordinates(city);
        const { temperature, description, icon } = await getWeather(lat, lon);

        weatherInfo.innerHTML = `
            <h2>${city}</h2>
            <p>Temperatura: ${temperature}°C</p>
            <p>Clima: ${description}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        `;
    } catch (error) {
        weatherInfo.innerHTML = `<p>${error.message}</p>`;
    } finally {
        loadingElement.classList.add('hidden');
    }
});



