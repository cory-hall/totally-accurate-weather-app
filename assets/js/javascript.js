// GLOBAL DOCUMENT ACCESS VARIABLES
var searchBtnEl = document.querySelector(".search-btn");
var cityInputEl = document.querySelector(".city-input");
var stateInputEl = document.querySelector(".state-input");
var countryInputEl = document.querySelector(".country-input");
var cityBtnEl = $(".city-btn");
// array used to save city search
var savedCities = [];

// set date format
var today = moment().format("M/D/YYYY");
// degree symbol
var degree = "\xB0"
// api key for weather api
var apiKey = "f96e5fd71a5037acc5f58ee9734e885b";

// function to handle when the search button is clicked
function searchButtonHandler(event) {
   event.preventDefault();

   // getting user inputs
   var cityInput = cityInputEl.value.trim().toUpperCase();
   var stateInput = stateInputEl.value.trim().toUpperCase();
   var countryInput = countryInputEl.value.trim().toUpperCase();

   // testing whether any information was input
   if (cityInput) {
      getCords(cityInput, stateInput, countryInput);

      // clear the fields after submit
      cityInputEl.value = "";
      stateInputEl.value = "";
      countryInputEl.value = "";
   } else {
      alert("Please enter a city.");
   }
};

// function to get latitude and longitude of city
function getCords(cityInput, stateInput, countryInput) {
   var lat = "";
   var lon = "";
   var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "," + stateInput + "," + countryInput + "&limit=1&appid=" + apiKey;

   // not every country has a state, so allow the state input field to be left empty
   if (!stateInput) {
      apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "," + countryInput + "&limit=1&appid=" + apiKey;
   }

   if (!stateInput && !countryInput) {
      apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=1&appid=" + apiKey;
   }
   // fetch data from api
   fetch(apiUrl).then(function (response) {
      if (response.ok) {
         console.log(response)
         response.json().then(function (data) {
            // get latitude and longitude
            lat = data[0].lat;
            lon = data[0].lon;

            // pass required data to get the weather
            getWeather(cityInput, lat, lon);
         })
      }
   })
      // handle user/api error
      .catch(function (error) {
         alert("Something went wrong, please check the spelling of your city.")
      });

};

// function to get the weather based on latitude and longitude
function getWeather(cityInput, lat, lon) {
   var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey

   // fetch weather data from api
   fetch(apiUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            // get required data from api call
            var temp = data.current.temp;
            var wind = data.current.wind_speed;
            var humidity = data.current.humidity;
            var uvi = data.current.uvi;
            var icon = data.current.weather[0].icon;

            //pass all data to write current weather block
            writeWeather(cityInput, temp, wind, humidity, uvi, icon);
            // clear the 5 day forecast cards
            clearFiveDay();
            // rewrite the 5 day forecast cards
            writeFiveDay(data.daily);
            // create a button based on search
            createCityButton(cityInput, lat, lon);
         });
      }
   })
      // handle api error
      .catch(function (error) {
         alert("Unable to get your weather.");
      });
};

// function to write the current day weather block
function writeWeather(cityInput, temp, wind, humidity, uvi, icon) {
   // get current weather icon
   var weatherIcon = "http://openweathermap.org/img/w/" + icon + ".png";
   // get current weather block html elements
   var cityNameEl = document.querySelector(".city");
   var tempEl = document.querySelector(".temp");
   var windEl = document.querySelector(".wind");
   var humidityEl = document.querySelector(".humidity");
   var iconEl = document.createElement("img");
   // set the icon image source
   iconEl.src = weatherIcon;

   // add city name and date
   cityNameEl.textContent = cityInput + " (" + today + ")";
   // add weather icon
   cityNameEl.appendChild(iconEl);
   // add temp
   tempEl.textContent = "Temp: " + temp + degree + "F";
   // add wind speed
   windEl.textContent = "Wind: " + wind + " MPH";
   // add humidity
   humidityEl.textContent = "Humidity: " + humidity + "%";
   // call function to calculate UV Index
   uvScale(uvi);

};

// function to generate 5 day forecast cards
function writeFiveDay(data) {
   // access the row for the cards
   var cardRowEl = document.querySelector(".card-row");
   // generate 5 day forecast text
   var forecastTextEl = document.querySelector(".forecast-text");
   forecastTextEl.textContent = "5-day Forecast:"

   // 5 total cards, 5 loops
   for (var i = 0; i < 5; i++) {
      // get data from 5 day forecast data from passed data array of objects
      var tempMax = data[i].temp.max;
      var tempMin = data[i].temp.min;
      var wind = data[i].wind_speed;
      var humidity = data[i].humidity;

      // generate weather icon
      var iconEl = document.createElement("img");
      var icon = data[i].weather[0].icon;
      var weatherIcon = "http://openweathermap.org/img/w/" + icon + ".png"
      iconEl.src = weatherIcon;

      // create card div
      var cardEl = document.createElement("div");
      cardEl.className = "card five-day justify-content-around";

      // generate and add card body
      var cardBodyEl = document.createElement("div");
      cardBodyEl.className = "card-body"
      cardEl.appendChild(cardBodyEl);

      // generate and add card date
      var cardDateEl = document.createElement("h5");
      cardDateEl.className = "card-date";
      var tomorrow = moment().add(i + 1, "d");
      cardDateEl.textContent = tomorrow.format("M/D/YYYY");
      cardEl.appendChild(cardDateEl);

      // add weather icon
      iconEl.className = "card-img";
      cardEl.appendChild(iconEl);

      // generate and add card temp
      var cardTempEl = document.createElement("p");
      cardTempEl.className = "card-temp";
      cardTempEl.textContent = "Temp: " + tempMin + degree + "F - " + tempMax + degree + "F";
      cardEl.appendChild(cardTempEl);

      // generate and add card wind speed
      var cardWindEl = document.createElement("p");
      cardWindEl.className = "card-wind";
      cardWindEl.textContent = "Wind: " + wind + " MPH";
      cardEl.appendChild(cardWindEl);

      // generate and add card humidity
      var cardHumidityEl = document.createElement("p");
      cardHumidityEl.className = "card-humidity";
      cardHumidityEl.textContent = "Humidity: " + humidity + "%"
      cardEl.appendChild(cardHumidityEl);

      // add card to row
      cardRowEl.appendChild(cardEl);
   }
}

// function used to determine severity of UV Index (uvi) with common color scheme
function uvScale(uvi) {
   // get html element
   var uviEl = document.querySelector(".uv-index");
   // create new element to add
   var uviNumEl = document.createElement("div");

   // if uvi is less than or equal to 2, add uvi with color green
   if (uvi <= 2) {
      uviNumEl.className = "uv-green uv-number";
      uviNumEl.textContent = " " + uvi;
      uviEl.textContent = "UV Index: ";
      uviEl.appendChild(uviNumEl);

      // if uis is between 3 and 5, add uvi with color yellow
   } else if (uvi > 2 && uvi <= 5) {
      uviNumEl.className = "uv-yellow uv-number";
      uviNumEl.textContent = " " + uvi;
      uviEl.textContent = "UV Index: ";
      uviEl.appendChild(uviNumEl);

      // if uvi is between 6 and 7, add uvi with color orange
   } else if (uvi > 5 && uvi <= 7) {
      uviNumEl.className = "uv-orange uv-number";
      uviNumEl.textContent = " " + uvi;
      uviEl.textContent = "UV Index:  ";
      uviEl.appendChild(uviNumEl);

      // if uvi is between 8 and 10, add uvi with color red
   } else if (uvi > 7 && uvi <= 10) {
      uviNumEl.className = "uv-red uv-number";
      uviNumEl.textContent = " " + uvi;
      uviEl.textContent = "UV Index: ";
      uviEl.appendChild(uviNumEl);

      // if uvi is 11 or above, add uvi with color purple
   } else {
      uviNumEl.className = "uv-purple uv-number";
      uviNumEl.textContent = " " + uvi;
      uviEl.textContent = "UV Index: ";
      uviEl.appendChild(uviNumEl);
   }
};

// simple function to clear the 5 day forecast when displaying new forecast
function clearFiveDay() {
   // get html elements
   var cardRowEl = document.querySelector(".card-row");
   var forecastTextEl = document.querySelector(".forecast-text")

   // make elements empty
   cardRowEl.innerHTML = "";
   forecastTextEl.innerHTML = "";
};

// function used to create a button for each city search
function createCityButton(cityName, lat, lon) {
   // get html element to hold all city buttons
   var cityBtnColEl = document.querySelector(".city-btn-col");

   // create city button element
   var cityBtnEl = document.createElement("button");
   // make class name
   cityBtnEl.className = "city-btn";
   // add datasets to make future use easier
   cityBtnEl.dataset.lat = lat;
   cityBtnEl.dataset.lon = lon;
   // set textContent of button to cityName
   cityBtnEl.textContent = cityName;

   // create a temp object to store search details
   var tempObj = {
      "cityName": cityName,
      "lat": lat,
      "lon": lon
   }

   // if global array is empty
   if (savedCities.length === 0) {
      // push the temp object to the array
      savedCities.push(tempObj);
      // add the city button to the page
      cityBtnColEl.appendChild(cityBtnEl);
      // save the data to localStorage
      saveWeather();
   } else {
      // if global array contains data, search the global array if it
      // already contains cityName, test will become true if global
      // array contains cityName
      var test = savedCities.some(i => i.cityName.includes(cityName));

      // if the global array does not contain the cityName
      if (test !== true) {
         // push the temp object to the global array
         savedCities.push(tempObj);
         // add the city button to the page
         cityBtnColEl.appendChild(cityBtnEl);
         // save the data to localStorage
         saveWeather();
      }
   }
};

// this function is similar to the previous one, except it only calls one time (on page load)
function createCityButtonOnLoad(cityName, lat, lon) {
   // get the html element to hold all city buttons
   var cityBtnColEl = document.querySelector(".city-btn-col");

   // create the button, as in the previous function
   var cityBtnEl = document.createElement("button");
   cityBtnEl.className = "city-btn";
   cityBtnEl.dataset.lat = lat;
   cityBtnEl.dataset.lon = lon;
   cityBtnEl.textContent = cityName;

   // add city button to page
   cityBtnColEl.appendChild(cityBtnEl);
}

// function used to recall previously searched city and display weather from button press
function cityButtonWeatherGenerator(event) {
   // get the target button
   var target = event.target;

   // get cityName from textContent of button
   var cityInput = target.textContent;
   // get latitude from button dataset
   var lat = parseFloat(target.dataset.lat);
   // get longitude from button dataset
   var lon = parseFloat(target.dataset.lon);

   // pass required data to generate the html again
   getWeather(cityInput, lat, lon)
}

// simple function to store global array to localStorage
function saveWeather() {
   localStorage.setItem("weather", JSON.stringify(savedCities));
}

// function used to get the localStorage data into the global array
function loadWeather() {
   // pull data from localStorage into global array
   savedCities = JSON.parse(localStorage.getItem("weather"));

   // if global array contains data
   if (savedCities) {
      // iterate over array
      for (var i = 0; i < savedCities.length; i++) {
         // extract data from global array
         var cityName = savedCities[i].cityName;
         var lat = savedCities[i].lat;
         var lon = savedCities[i].lon;

         // create the buttons, but do not populate current weather block or 5 day forecast
         createCityButtonOnLoad(cityName, lat, lon);
      }
   } else {
      savedCities = [];
   }
}

// event listener on search button click
searchBtnEl.addEventListener("click", searchButtonHandler);
// event listener on page load
addEventListener("load", loadWeather);

// event listener on specific city button clicks
$("body").on("click", ".city-btn", function () {
   cityButtonWeatherGenerator(event);
});
