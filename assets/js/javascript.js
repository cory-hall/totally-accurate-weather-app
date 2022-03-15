var searchBtnEl = document.querySelector(".search-btn");
var cityInputEl = document.querySelector(".city-input");
var stateInputEl = document.querySelector(".state-input");
var countryInputEl = document.querySelector(".country-input");

var today = moment().format("M/D/YYYY")
var degree = "\xB0"

var apiKey = "f96e5fd71a5037acc5f58ee9734e885b";

function searchButtonHandler(event) {
   event.preventDefault();

   var cityInput = cityInputEl.value.trim();
   var stateInput = stateInputEl.value.trim();
   var countryInput = countryInputEl.value.trim();

   if (cityInput && countryInput) {
      getCords(cityInput, stateInput, countryInput)

      cityInputEl.value = "";
      stateInputEl.value = "";
      countryInputEl.value = "";

   }
};

function getCords(cityInput, stateInput, countryInput) {
   var lat = "";
   var lon = "";
   var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "," + stateInput + "," + countryInput + "&limit=1&appid=" + apiKey;

   if (stateInput == null) {
      "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "," + countryInput + "&limit=1&appid=" + apiKey;
   }
   fetch(apiUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            lat = data[0].lat;
            lon = data[0].lon;

            getWeather(cityInput, lat, lon);
         });
      }
   });
};

function getWeather(cityInput, lat, lon) {
   var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey

   fetch(apiUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvi = data.current.uvi;
            var icon = data.current.weather[0].icon;

            writeWeather(cityInput, temp, wind, humidity, uvi, icon);
            writeFiveDay(data.daily);
         })
      }
   })
};

function writeWeather(cityInput, temp, wind, humidity, uvi, icon) {
   var weatherIcon = "http://openweathermap.org/img/w/" + icon + ".png"
   var cityNameEl = document.querySelector(".city");
   var tempEl = document.querySelector(".temp");
   var windEl = document.querySelector(".wind");
   var humidityEl = document.querySelector(".humidity");
   var iconEl = document.createElement("img");

   iconEl.src = weatherIcon;

   cityNameEl.textContent = cityInput.toUpperCase() + " (" + today + ")";
   cityNameEl.appendChild(iconEl);
   tempEl.textContent = "Temp: " + temp + "degree F";
   windEl.textContent = "Wind: " + wind + " MPH";
   humidityEl.textContent = "Humidity: " + humidity + "%";
   uvScale(uvi);

};

function writeFiveDay(data) {
   console.log(data)

   var cardRowEl = document.querySelector(".card-row");

   for (var i = 0; i < 5; i++) {

      var tempMax = data[i].temp.max;
      var tempMin = data[i].temp.min;
      var wind = data[i].wind;
      var humidity = data[i].humidity;

      var cardEl = document.createElement("div");
      cardEl.className = "card five-day";

      var cardBodyEl = document.createElement("div");
      cardBodyEl.className = "card-body"
      cardEl.appendChild(cardBodyEl);

      var cardDateEl = document.createElement("h5");
      cardDateEl.className = "card-date";
      moment().add(i + 1, "d");
      cardDateEl.textContent = today;
      cardEl.appendChild(cardDateEl);

      var cardImgEl = document.createElement("img");
      cardImgEl.className = "card-img";

      var cardTempEl = document.createElement("p");
      cardTempEl.className = "card-temp";
      cardTempEl.textContent = temp + degree + " F";
      cardEl.appendChild(cardTempEl);

      var cardWindEl = document.createElement("p");
      cardWindEl.className = "card-wind";
      cardWindEl.textContent = wind + " MPH";
      cardEl.appendChild(cardWindEl);

      var cardHumidityEl = document.createElement("p");
      cardHumidityEl.className = "card-humidity";
      cardHumidityEl.textContent = humidity + "%"
      cardEl.appendChild(cardHumidityEl);

      cardRowEl.appendChild(cardEl);
   }
}

function uvScale(uvi) {
   var eviEl = document.querySelector(".uv-index");
   var uviText = "UV Index: " + uvi;

   if (uvi <= 2) {
      eviEl.classList.add("uv-green");
      eviEl.textContent = uviText;
   } else if (uvi > 2 && uvi <= 5) {
      eviEl.classList.add("uv-yellow");
      eviEl.textContent = uviText;
   } else if (uvi > 5 && uvi <= 7) {
      eviEl.classList.add("uv-orange");
      eviEl.textContent = uviText;
   } else if (uvi > 7 && uvi <= 10) {
      eviEl.classList.add("uv-red");
      eviEl.textContent = uviText;
   } else {
      eviEl.classList.add("uv-purple");
      eviEl.textContent = uviText;
   }
}

searchBtnEl.addEventListener("click", searchButtonHandler)