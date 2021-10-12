const weatherIconEl = document.querySelector("#weather-icon");
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#city-search");
const currentHeadingEl = document.querySelector("#current-heading");
const currentDataEl = document.querySelector("#current-data");

const temp = (document.createElement("span"))
const wind = (document.createElement("span"))
const humid = (document.createElement("span"))
const uvi = (document.createElement("span"))

//when a city is searched for, send that cityName to getCoordinates()
let formSubmitHandler = function(event) {
    //debugger;
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
            let icon = data.current.weather[0].icon
            document.getElementById("weather-icon").src = "https://openweathermap.org/img/w/" + icon + ".png";
        })
}

//display the current weather in the top div
let displayCurrentWeather = function(data) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + data.lat + "&lon=" + data.lon + "&limit=1&appid=efc693abd192802e32ec5e23919e5afe"
    let icon = data.current.weather[0].icon
    let iconLink = "https://openweathermap.org/img/w/" + icon + ".png"
    fetch(apiUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data[0].name)
            currentHeadingEl.innerHTML = data[0].name + " (" + moment().format("M/D/YYYY") + ") ";
            currentHeadingEl.appendChild(document.createElement("img")).src = iconLink
        })
        //define weather data variables

    temp.innerHTML = "Temp: " + data.current.temp + " \u00B0F"
    temp.className = "d-block"

    wind.innerHTML = "Wind: " + data.current.wind_speed + " MPH"
    wind.className = "d-block"

    humid.innerHTML = "Humidity: " + data.current.humidity + " %"
    humid.className = "d-block"

    uvi.innerHTML = "UV Index: " + data.current.uvi
    uvi.className = "d-block"
        //print variable to screen
    currentDataEl.appendChild(temp);
    currentDataEl.appendChild(wind);
    currentDataEl.appendChild(humid);
    currentDataEl.appendChild(uvi);
}

searchFormEl.addEventListener("submit", formSubmitHandler);