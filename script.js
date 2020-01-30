/*********************************************************************************************************/
/*                                      AUTHOR: Pranitha Maganty                                         */
/*                                          TITLE: script.js                                             */
/*                                    PROJECT: Weather Dashboard                                         */
/*********************************************************************************************************/

//
//
//
//
//

/******************************START: VARIABLE DEFINITIONS AND INTITIALIZATIONS***************************/
var cities = [];
localStorage.setItem("cities", JSON.stringify(cities));
/*******************************END: VARIABLE DEFINITIONS AND INTITIALIZATIONS****************************/

//
//
//
//
//

/****************************************START: FUNCTION DEFINITIONS**************************************/

//FUNCTION DESCRIPTION: Append basic current weather statistics to dom
function appendStats(city, temp, humidity, wind_speed, uvi, current_icon) {
    $("#city_name_date").text(city + " (" + moment().format('L') + ")");
    $("#temp").text("Temperature: " + temp + " °F");
    $("#humidity").text("Humidity: " + humidity + "%");
    $("#wind_speed").text("Wind Speed: " + wind_speed + " MPH");
    $("#uv").text("UV Index: " + uvi);
    $("#current_icon").attr("src", "http://openweathermap.org/img/wn/" + current_icon + ".png")
}

//FUNCTION DESCRIPTION: Makes sure storage does not add duplicates and most recent search is added to top
function reconfigureStorage(currentStorage) {
    var recentCity = currentStorage[0];
    for(var i = 1; i < currentStorage.length; i++) {
        if (currentStorage[i] == recentCity) {
            currentStorage.splice(i,1);
            i = i - 1;
        }
    }
}

//FUNCTION DESCRIPTION: Appending everything from local storage to dom to show list of searched cities
function appendCity (currentStorage) {
    $("#tbody").empty();
    for (var i = 0; i < currentStorage.length; i++) {
        var newRow = $("<tr>");
        var newCity = $("<p>");
        newCity.text(currentStorage[i]);
        newCity.addClass("each_city");
        newRow.append(newCity);
        newCity.attr("data-city", currentStorage[i]);
        newRow.attr("id", currentStorage[i]);
        newRow.addClass("city_button");
        $("#tbody").append(newRow);
    }
}

//FUNCTION DESCRIPTION: Colors UVI index based on severity of index number
function checkUVI (uvi) {
    if (uvi <= 2) {
        $("#uv").addClass("lowUVI");
    } else if (uvi > 2 && uvi < 7) {
        $("#uv").addClass("modUVI");
    } else if (uvi >= 7) {
        $("#uv").addClass("highUVI");
    }
}

//FUNCTION DESCRIPTION: Pulls in all info from APIs using ajax, analyzes info, and uses above functions
//                      to append necessary info to DOM
function grabInfoFromAPI(city) {
    var api_key = "84ab9678dac20fcd54d42772d5959ce5";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api_key;

    var currentStorage = JSON.parse(localStorage.getItem('cities'));
    

   $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        console.log(response); //FOR DEBUG
        var city = response.name;
        var temp = JSON.stringify(Math.floor((response.main.temp * (9/5) - 459.67)));
        var humidity = response.main.humidity;
        var wind_speed = response.wind.speed;
        var current_icon = response.weather[0].icon;

        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var uv_url = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + api_key + "&lat=" + lat + "&lon=" + lon;
    
        $.ajax({
            url: uv_url,
            method: "GET"
            })
            .then(function(response) {
                console.log(response); //FOR DEBUG
                var uvi = response.value;
                appendStats(city, temp, humidity, wind_speed, uvi, current_icon);
                checkUVI(uvi);
        });

        currentStorage.unshift(city);
        reconfigureStorage(currentStorage);
        localStorage.setItem("cities", JSON.stringify(currentStorage));

        appendCity(currentStorage);

        forecast_url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + api_key;

        $.ajax({
            url: forecast_url,
            method: "GET"
            })
            .then(function(response) {
                console.log(response); //FOR DEBUG
                $("#five_day").show();
                var count = 1;
                var day_count = 1;
                for (var i = 3; i < 36; i = i + 8) {
                    if ((i == 3) || (i == 11) || (i == 19) || (i == 27) || (i == 35)) {
                        var id = "#day" + (day_count);
                        var currentDay = $(id);
                        currentDay.empty();
                        var currentDate = $("<p>");
                        var currentIcon = $("<img>");
                        var currentTemp = $("<p>");
                        var currentHumidity = $("<p>");
                        currentDate.text(moment().add(count, 'days').format('L'));
                        currentDate.addClass("forecast_date");
                        currentIcon.attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png");
                        currentIcon.addClass("forecast_text");
                        currentTemp.text("Temp: " + Math.floor((response.list[i].main.temp * (9/5) - 459.67)) + " °F");
                        currentTemp.addClass("forecast_text");
                        currentHumidity.text("Humidity: " + response.list[i].main.humidity + "%");
                        currentHumidity.addClass("forecast_text");

                        currentDay.append(currentDate);
                        currentDay.append(currentIcon);
                        currentDay.append(currentTemp);
                        currentDay.append(currentHumidity);

                        count++;
                        day_count++;
                    }
                }

            });
    });
        
}
/****************************************END: FUNCTION DEFINITIONS****************************************/

//
//
//
//
//

/******************************************START: EVENT LISTENERS******************************************/

//EVENT LISTENER DEFINITION: when search button is clicked, grab info from API and append necessary info
//                           to the DOM
$("#search_btn").click(function() {
    var city = $("#search_val").val().toLowerCase();
    $("#basic_info").show();
    grabInfoFromAPI(city);
});

//EVENT LISTENER DEFINITION: when any city listed on left hand side is clicked, grab info from API and
//                           append necessary info to the DOM
$(document).on("click", ".each_city", function () {
    var city = $(this).attr("data-city").toLowerCase();
    grabInfoFromAPI(city);
});
/*******************************************END: EVENT LISTENERS*******************************************/

//
//
//
//
//

/**************************************START: PRELIMINARY EXECUTIONS**************************************/
$("#five_day").hide();
$("#basic_info").hide();
/***************************************END: PRELIMINARY EXECUTIONS***************************************/
