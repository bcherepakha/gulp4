// https://samples.openweathermap.org/data/2.5/weather?q=Kiev&appid=d27db2de84247e2ea89df726ce488fa1

fetch('/weather?q=Kiev&appid=d27db2de84247e2ea89df726ce488fa1')
    .then(response => response.json())
    .then(console.log)
