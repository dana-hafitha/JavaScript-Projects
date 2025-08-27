async function getWeatherData(city_name){
    let result = await fetch(`http://api.weatherstack.com/current?access_key=8510dcaa9718cb729c8189439b5cc65d&query=${city_name}`);
    let data =  await result.json();

    let city = document.getElementById("city");
    city.textContent = city_name;

    let temperature = document.getElementById("temperature");
    temperature.textContent = `the current temperature is ${data.current.temperature} °C`;

    let humidity = document.getElementById("humidity");
    humidity.textContent = `the current humidity is ${data.current.humidity} %`;

    let description = document.getElementById("description");
    description.textContent = `the current weather is ${data.current.weather_descriptions[0]}`;

    console.log(temperature.textContent);
    console.log(humidity.textContent);
    console.log(description.textContent);
    
}

function getCity (){
    let city = document.getElementById("city-input");
    return city.value.trim();
}

let btn = document.getElementById("submitBtn");

btn.addEventListener("click", (event)=>{
    event.preventDefault(); // to prevent the default form submission
    let city_name = getCity();
    if (city_name !== ""){
        // there is a city 
        console.log(city_name)
        getWeatherData(city_name);
    }
    else{
        alert("Enter a city name first");
    }
});
