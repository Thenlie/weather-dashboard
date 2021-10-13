//global variables
const weatherIconEl = document.querySelector("#weather-icon");
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#city-search");
const currentHeadingEl = document.querySelector("#current-heading");
const currentDataEl = document.querySelector("#current-data");
const temp = document.querySelector("#temp")
const wind = document.querySelector("#wind")
const humid = document.querySelector("#humid")
const uvi = document.querySelector("#uvi")

//when a city is searched for, send that cityName to getCoordinates()
let formSubmitHandler = function(event) {
    event.preventDefault();
    let cityName = searchInputEl.value.trim();
    searchInputEl.value = "";
    //ensure something was entered, not necessarily valid
    if (cityName) {
        getCoordinates(cityName);
    } else {
        alert("Please enter a city name!")
        return;
    }
}

//take cityName and turn it into lat and lon coordinates
let getCoordinates = function(cityName) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=efc693abd192802e32ec5e23919e5afe"
    fetch(apiUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            let lat = (data[0].lat)
            let lon = (data[0].lon)
            getWeather(lat, lon)
        })
        //if city name is not valid =>
        .catch(function(error) {
            alert("Please enter a valid city name!");
            return;
        })
}

//take coordinates and send them to OpenWeather
let getWeather = function(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=efc693abd192802e32ec5e23919e5afe"
    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                alert("Please enter a valid city coordiante!")
            }
        })
        .then(function(data) {
            displayCurrentWeather(data);
            displayForecast(data);
        })
}

//display the current weather in the top div
let displayCurrentWeather = function(data) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + data.lat + "&lon=" + data.lon + "&limit=1&appid=efc693abd192802e32ec5e23919e5afe"
    let iconLink = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"
    fetch(apiUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            currentHeadingEl.innerHTML = data[0].name + " (" + moment().format("M/D/YYYY") + ") ";
            currentHeadingEl.appendChild(document.createElement("img")).src = iconLink
        })
        //define weather data variables
    temp.textContent = "Temp: " + data.current.temp + " \u00B0F"
    wind.textContent = "Wind: " + data.current.wind_speed + " MPH"
    humid.textContent = "Humidity: " + data.current.humidity + " %"
    uvi.textContent = "UV Index: " + data.current.uvi
}

let displayForecast = function(data) {
    //add date
    for (i = 1; i < 6; i++) {
        let current = document.querySelector("#card" + i + "-title")
        current.textContent = moment().add(i, 'd').format("M/D/YYYY");
    }

    //add weather data
    for (j = 0; j < 5; j++) {
        let currentData = data.daily[j]
        let iconLink = "https://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png"
        let icon = document.querySelector("#card" + j + "-icon");
        icon.src = iconLink
        let temp = document.querySelector("#card" + j + "-temp")
        temp.innerHTML = "Temp: " + currentData.temp.day + " \u00B0F"
        let wind = document.querySelector("#card" + j + "-wind")
        wind.innerHTML = "Wind: " + currentData.wind_speed + " MPH"
        let humid = document.querySelector("#card" + j + "-humid")
        humid.innerHTML = "Humidity: " + currentData.humidity + " %"
    }
}

searchFormEl.addEventListener("submit", formSubmitHandler);