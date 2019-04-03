const http = new XMLHttpRequest();
const outfit_pick_url = "/clothes"
const yahoo_weather_url = "/yahoo_weather"

var yahoo_data

function getOutfitPickImage(yahoo_data)
{
    http.open("POST", outfit_pick_url)
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    http.send(JSON.stringify({
        "gender": sessionStorage.getItem('gender'),
        "attire": sessionStorage.getItem('attire'),
        "temperature": yahoo_data.current_observation.condition.temperature,
        "condition": yahoo_data.current_observation.condition.text,
    }))

    http.onreadystatechange = (e) =>
    {
        if(http.readyState == 4 && http.status == 200)
        {
            var res = JSON.parse(http.responseText)

            // change clothes according to mongodb query

            console.log(res)

            var upper_attire = document.getElementsByClassName('upper_option')
            var lower_attire = document.getElementsByClassName('lower_option')
            var foot_attire = document.getElementsByClassName('foot_option')

            var upper_i = 0, lower_i = 0, foot_i = 0

            for (var i = 0; i < res.length; i++)
            {
                var key = res[i]
                if(key.type === 'upper')
                {
                    upper_attire[upper_i++].lastElementChild.src = key.src + '.jpg'
                }
                if(key.type === 'lower')
                {
                    lower_attire[lower_i++].lastElementChild.src = key.src + '.jpg'
                }
                if(key.type === 'foot')
                {
                    foot_attire[foot_i++].lastElementChild.src = key.src + '.jpg'
                }
            }
        }
    }
}

function getYahooWeatherData()
{
    http.open("POST", yahoo_weather_url)
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    http.send(JSON.stringify({
        "location": sessionStorage.getItem('location')
    }))

    http.onreadystatechange = (e) =>
    {
        if(http.readyState == 4 && http.status == 200)
        {
            var res = JSON.parse(http.responseText)

            yahoo_data = res

            // get the div of the weather
            var degree = document.getElementById('degrees')

            degree.innerHTML = yahoo_data.current_observation.condition.temperature

            var location = document.getElementById('location')

            location.innerHTML = yahoo_data.location.city +
                                    ", " + yahoo_data.location.region

            var condition = document.getElementById('type')

            condition.innerHTML = yahoo_data.current_observation.condition.text

            var currentdate = new Date()

            var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1)  + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes()

            var date = document.getElementById('date')

            date.innerHTML = datetime

            // change the background according to condition

            var weather = yahoo_data.current_observation.condition.code;
            if(weather <= 12) {
                document.body.style.backgroundImage = "url('../image/weather/rainy_sky.jpg')";
                document.body.style.backgroundSize = "15% 17em";
            } else if(weather >= 13 && weather <= 18) {
                document.body.style.backgroundImage = "url('../image/weather/snowy_sky.jpg')";
                document.body.style.backgroundSize = "100% 17em";
            } else if(weather >= 19 && weather <= 26) {
                document.body.style.backgroundImage = "url('../image/weather/gray_sky.jpg')";
                document.body.style.backgroundSize = "100% 17em";
            } else if(weather == 27 || weather == 29) {
                document.body.style.backgroundImage = "url('../image/weather/cloudy_night_sky.jpg')";
                document.body.style.backgroundSize = "100% 17em";
                document.getElementById("logo_text").style.color = "white";
                document.getElementById("degrees").style.color = "white";
                document.getElementById("location").style.color = "white";
                document.getElementById("type").style.color = "white";
                document.getElementById("date").style.color = "white";
            } else if(weather == 31 || weather == 33) {
                document.body.style.backgroundImage = "url('../image/weather/clear_night_sky.jpg')";
                document.body.style.backgroundSize = "50% 17em";
                document.getElementById("logo_text").style.color = "white";
                document.getElementById("degrees").style.color = "white";
                document.getElementById("location").style.color = "white";
                document.getElementById("type").style.color = "white";
                document.getElementById("date").style.color = "white";
            } else if(weather == 32 || weather == 34 || weather == 36) {
                document.body.style.backgroundImage = "url('../image/weather/blue_sky.jpg')";
                document.body.style.backgroundSize = "100% 17em";
            }
        }
    }
}

getYahooWeatherData()

setTimeout(function() {
    console.log(yahoo_data)
    getOutfitPickImage(yahoo_data)
 }, 500)
