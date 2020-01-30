/*********************************************************************************************************/
/*                                      AUTHOR: Pranitha Maganty                                         */
/*                                          TITLE: script.js                                             */
/*                                    PROJECT: Weather Dashboard                                         */
/*********************************************************************************************************/
var cities = [];
//if(!localStorage.getItem("cities")){
    localStorage.setItem("cities", JSON.stringify(cities));
//}

function appendStats(city, temp, humidity, wind_speed, uvi, current_icon) {
    console.log(city); //FOR DEBUG
    $("#city_name_date").text(city + " (" + moment().format('L') + ")");
    console.log(temp); //FOR DEBUG
    $("#temp").text("Temperature: " + temp + " °F");
    $("#humidity").text("Humidity: " + humidity + "%");
    $("#wind_speed").text("Wind Speed: " + wind_speed + " MPH");
    $("#uv").text("UV Index: " + uvi);
    $("#current_icon").attr("src", "http://openweathermap.org/img/wn/" + current_icon + ".png")
}

function reconfigureStorage(currentStorage) {
    var recentCity = currentStorage[0];
    for(var i = 1; i < currentStorage.length; i++) {
        if (currentStorage[i] == recentCity) {
            currentStorage.splice(i,1);
            i = i - 1;
        }
    }
}

function appendCity (currentStorage) {
    //if (doesCityExist == true) {
        //$("#" + city).empty();
    //}
    //var mostRecent = currentStorage[0];
    $("#tbody").empty();
    for (var i = 0; i < currentStorage.length; i++) {
        //if (currentStorage[i] != city) {
            var newRow = $("<tr>");
            var newCity = $("<p>");
            newCity.text(currentStorage[i]);
            newCity.addClass("each_city");
            newRow.append(newCity);
            newCity.attr("data-city", currentStorage[i]);
            newRow.attr("id", currentStorage[i]);
            newRow.addClass("city_button");
            $("#tbody").append(newRow);
        //}
    }

    //doesCityExist = false;
}

function checkUVI (uvi) {
    if (uvi <= 2) {
        $("#uv").addClass("lowUVI");
    } else if (uvi > 2 && uvi < 7) {
        $("#uv").addClass("modUVI");
    } else if (uvi >= 7) {
        $("#uv").addClass("highUVI");
    }
}

$("#five_day").hide();
$("#basic_info").hide();

$("#search_btn").click(function (event) {
    event.preventDefault();

    $("#basic_info").show();
    var exists = false;
    var city = $("#search_val").val().toLowerCase();//"austin";
    var currentStorage = JSON.parse(localStorage.getItem('cities'));


    /*if (!doesCityExist(currentStorage, city)) {
        currentStorage.unshift(city);
        exists = false;
    } else {
        exists = true;
    }*/

    var api_key = "84ab9678dac20fcd54d42772d5959ce5";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api_key;

   $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        console.log(response); //FOR DEBUG
        var city = response.name;
        console.log(city); //FOR DEBUG
        var temp = JSON.stringify(Math.floor((response.main.temp * (9/5) - 459.67)));
        console.log(temp); //FOR DEBUG
        var humidity = response.main.humidity;
        console.log(humidity); //FOR DEBUG
        var wind_speed = response.wind.speed;
        console.log(wind_speed); //FOR DEBUG
        var current_icon = response.weather[0].icon;

        var lat = response.coord.lat;
        console.log(lat); //FOR DEBUG
        var lon = response.coord.lon;
        console.log(lon); //FOR DEBUG

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

        //var uv_url = "http://api.openweathermap.org/data/2.5/uvi?appid=b6907d289e10d714a6e88b30761fae22&lat=37.75&lon=-122.37";


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
                    console.log(i);
                    if ((i == 3) || (i == 11) || (i == 19) || (i == 27) || (i == 35)) {
                        var id = "#day" + (day_count);
                        console.log(id); //FOR DEBUG
                        var currentDay = $(id);
                        console.log(currentDay); //FOR DEBUG
                        currentDay.empty();
                        var currentDate = $("<p>");
                        var currentIcon = $("<img>");
                        var currentTemp = $("<p>");
                        var currentHumidity = $("<p>");
                        //response.list[i].weather[0].icon
                        console.log(moment().format('L')); //FOR DEBUG
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

});

$(document).on("click", ".each_city", function () {
    console.log("TR CLICKED"); //FOR DEBUG

    var city = $(this).attr("data-city").toLowerCase();//"austin";
    console.log($(this).attr("data-city")); //FOR DEBUG
    var currentStorage = JSON.parse(localStorage.getItem('cities'));
    //currentStorage.push(city);

    /*if (!doesCityExist(currentStorage, city)) {
        currentStorage.unshift(city);
        exists = false;
    } else {
        exists = true;
    }*/

    var api_key = "84ab9678dac20fcd54d42772d5959ce5";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api_key;

   $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        console.log(response); //FOR DEBUG
        var city = response.name;
        console.log(city); //FOR DEBUG
        var temp = JSON.stringify(response.main.temp);
        console.log(temp); //FOR DEBUG
        var humidity = response.main.humidity;
        console.log(humidity); //FOR DEBUG
        var wind_speed = response.wind.speed;
        console.log(wind_speed); //FOR DEBUG
        var current_icon = response.weather[0].icon;

        var lat = response.coord.lat;
        console.log(lat); //FOR DEBUG
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

        console.log(lon); //FOR DEBUG
        //var uv_url = "http://api.openweathermap.org/data/2.5/uvi?appid=b6907d289e10d714a6e88b30761fae22&lat=37.75&lon=-122.37";
        //var uv_url = "https://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=b6907d289e10d714a6e88b30761fae22";//"api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + api_key;
    
        //appendStats(city, temp, humidity, wind_speed);
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
                    console.log(i);
                    if ((i == 3) || (i == 11) || (i == 19) || (i == 27) || (i == 35)) {
                        var id = "#day" + (day_count);
                        console.log(id); //FOR DEBUG
                        var currentDay = $(id);
                        console.log(currentDay); //FOR DEBUG
                        currentDay.empty();
                        var currentDate = $("<p>");
                        var currentIcon = $("<img>");
                        var currentTemp = $("<p>");
                        var currentHumidity = $("<p>");
                        //response.list[i].weather[0].icon
                        console.log(moment().format('L')); //FOR DEBUG
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

});

