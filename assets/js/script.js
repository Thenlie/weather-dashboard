//global variables
var key = config.API_KEY;
const weatherIconEl = document.querySelector("#weather-icon");
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#city-search");
const currentHeadingEl = document.querySelector("#current-heading");
const currentDataEl = document.querySelector("#current-data");
const currentIconEl = document.querySelector("#current-icon");
const clearButtonEl = document.querySelector("#clear-btn");
const searchContainerEl = document.querySelector("#search-container")
const errorContainerEl = document.querySelector("#error-container");
const temp = document.querySelector("#temp");
const wind = document.querySelector("#wind");
const humid = document.querySelector("#humid");
const uvi = document.querySelector("#uvi");
let search = JSON.parse(localStorage.getItem("search") || "[]");

//when a city is searched for, send that cityName to getCoordinates()
let formSubmitHandler = function(event) {
    event.preventDefault();
    let cityName = searchInputEl.value.trim();
    searchInputEl.value = "";
    //ensure something was entered, not necessarily valid
    if (cityName) {
        getCoordinates(cityName);
        errorContainerEl.innerHTML = ""
    } else {
        errorContainerEl.innerHTML = "Please enter a city name!"
        return;
    }
}

//take cityName and turn it into lat and lon coordinates
let getCoordinates = function(cityName) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + key
    fetch(apiUrl)
        .then(function(res) {
            errorContainerEl.innerHTML = ""
            return res.json();
        })
        .then(function(data) {
            let lat = (data[0].lat)
            let lon = (data[0].lon)
            getWeather(lat, lon)
        })
        //if city name is not valid =>
        .catch(function(error) {
            errorContainerEl.innerHTML = "Please enter a valid city name!";
            return;
        })
}

//take coordinates and send them to OpenWeather
let getWeather = function(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key
    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                alert("Please enter a valid city coordinate!")
            }
        })
        .then(function(data) {
            displayWeather(data);
            displayForecast(data);
        })
}

//display the current weather in the top div
let displayWeather = function(data) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/reverse?lat=" + data.lat + "&lon=" + data.lon + "&limit=1&appid=" + key
    let iconLink = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"
    fetch(apiUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            currentHeadingEl.innerHTML = data[0].name + " (" + moment().format("M/D/YYYY") + ") ";
            currentIconEl.innerHTML = "<img src=" + iconLink + ">";
            saveSearch(data[0].name);
        })
        //define weather data variables
    temp.textContent = "Temp: " + data.current.temp + " \u00B0F"
    wind.textContent = "Wind: " + data.current.wind_speed + " MPH"
    humid.textContent = "Humidity: " + data.current.humidity + " %"
    if (data.current.uvi < 2) {
        uvi.innerHTML = "UV Index: " + "<span class='uvi-low'>" + data.current.uvi + "</span>"
    } else if (data.current.uvi < 5) {
        uvi.innerHTML = "UV Index: " + "<span class='uvi-mid'>" + data.current.uvi + "</span>"
    } else if (data.current.uvi < 7) {
        uvi.innerHTML = "UV Index: " + "<span class='uvi-high'>" + data.current.uvi + "</span>"
    } else {
        uvi.innerHTML = "UV Index: " + "<span class='uvi-vhigh'>" + data.current.uvi + "</span>"
    }
}

//display the 5 day forecast
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

//save search history
let saveSearch = function(cityName) {
    if (search.includes(cityName)) {
        return;
    } else {
        search.push(cityName)
        localStorage.setItem("search", JSON.stringify(search));
        loadSearch();
    }
}

//load search history when page loads
let loadSearch = function() {
    if (search.length > 0) {
        searchContainerEl.innerHTML = "";
        for (i = 0; i < search.length; i++) {
            let searchBtn = document.createElement("div")
            searchBtn.className = "search-btn w-100 m-0 mb-2"
            searchBtn.textContent = search[i]
            searchContainerEl.appendChild(searchBtn);
        }
    } else {
        searchContainerEl.innerHTML = "";
    }
}

let clearHistory = function() {
    search = [];
    localStorage.clear();
    loadSearch();
}

//search for location that is clicked on in history
let reSearch = function(event) {
    if (event.target.innerHTML.includes("<")) {
        return;
    } else {
        getCoordinates(event.target.innerHTML)
    }
}

loadSearch();
searchFormEl.addEventListener("submit", formSubmitHandler);
clearButtonEl.addEventListener("click", clearHistory);
searchContainerEl.addEventListener("click", reSearch);