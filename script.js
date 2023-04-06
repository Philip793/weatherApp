//Api Keys
var apiKey = "668797336c34de7c8db3c12526e01d66";
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
var apiUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast';

//Query Selector variables
var cityNameInput = document.querySelector('#city');
var searchButton = document.querySelector('.btn-search-today');
var searchForecastButton = document.querySelector('.btn-search-forecast');
var cityName = document.querySelector('#city');
var weatherIcon = document.querySelector('#weather-icon');
var temperature = document.querySelector('#temperature');
var humidity = document.querySelector('#humidity');
var windSpeed = document.querySelector('#wind-speed');
var forecastTable = document.querySelector('#five-day-forecast');
var searchHistoryContainer = document.querySelector('#search-history-container')

//local storage fuction
var savedCities = [];  

if (localStorage.getItem('searchHistory')) {
  savedCities = JSON.parse(localStorage.getItem('searchHistory'))
  displaySearchHistory()
}

function displaySearchHistory() {
  searchHistoryContainer.innerHTML = ''
  
  for (let index = 0; index < savedCities.length; index++) {
    var searchItem = document.createElement('div')
    searchItem.textContent = savedCities[index]
    searchHistoryContainer.appendChild(searchItem)
  }
}

//function to select the time on the page
var dateTimeEl = document.querySelector('#date-time')
const now = dayjs()
const dateFormatted = now.format('MMMM D, YYYY h:mm A')
dateTimeEl.textContent = dateFormatted;
console.log(dateFormatted);

function updateWeatherData(data) {
  cityName.textContent = data.name;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  temperature.textContent = `Temperature: ${Math.round(data.main.temp - 273.15)}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
}
  var cityValEl = document.querySelector('#cityVal')
function getWeatherData(city) {
  var url = `${apiUrl}?q=${city}&appid=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('hit')
      updateWeatherData(data);
      savedCities.push(city)
      cityValEl.textContent = city
      localStorage.setItem('searchHistory', JSON.stringify(savedCities))
      displaySearchHistory()
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//fuction to get the weather forcast data from the api

function updateWeatherForecast(data) {
  var forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  forecastTable.innerHTML = '';
  forecastData.forEach(item => {
    var article = document.createElement('article');
    article.classList.add("weather_forecast_item");
    var date = new Date(item.dt_txt);
    var day = date.toLocaleDateString('en-US', { weekday: 'short' });
    var time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    var iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    var temp = Math.round(item.main.temp - 273.15);
    var humidity = item.main.humidity;
    var windSpeed = item.wind.speed;
    article.innerHTML = `
    <h3 class="weather_forecast_day">${day} ${time}</h3>
    <img src="${iconUrl}" alt="${item.weather[0].description}">
    <p class="weather_forecast_results"> <span class="value">${temp}</span>&deg;C</p>
    <p class="weather_forecast_results"> <span class="value">${humidity}</span>&deg;%</p>
    <p class="weather_forecast_results"> <span class="value">${windSpeed}</span>&deg;m/s</p>
  `;
    forecastTable.appendChild(article);
  });
}

function getWeatherForecast(city) {
  var url = `${apiUrlForecast}?q=${city}&appid=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
     updateWeatherForecast(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



//event listeners for the click button
searchButton.addEventListener('click', () => {
  var city = cityNameInput.value.trim();
  cityNameInput.value = '';
  if (city) {
    getWeatherData(city);
    getWeatherForecast(city);
  }
});

cityNameInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    const city = cityNameInput.value.trim();
    if (city) {
      getWeatherData(city);
      getWeatherForecast(city);
    }
  }
});

getWeatherForecast(city);
