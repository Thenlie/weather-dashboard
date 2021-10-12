const weatherIconEl = document.querySelector("#weather-icon");
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#city-search");

let getWeather = function(lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=efc693abd192802e32ec5e23919e5afe"
    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                alert("Please enter a valid city coordiante!")
            }
        })
        .then(function(data) {
            console.log(data);
            let icon = data.current.weather[0].icon
            document.getElementById("weather-icon").src = "https://openweathermap.org/img/w/" + icon + ".png";
        })
}

//take cityName and turn it into lat and lon coordinates
let getCoordinates = function(cityName) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=efc693abd192802e32ec5e23919e5afe"
    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                alert("Please enter a valid city name!")
            }
        })
        .then(function(data) {
            let lat = (data[0].lat)
            let lon = (data[0].lon)
            getWeather(lat, lon)
        })
}

let formSubmitHandler = function(event) {
    event.preventDefault();
    let cityName = searchInputEl.value.trim();
    searchInputEl.value = "";
    getCoordinates(cityName);
}

searchFormEl.addEventListener("submit", formSubmitHandler);