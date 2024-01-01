const apiKey = "8810174c582fbbc07decb8ad688836dd";
const apiURL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchCityName = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(cityName) {
  try {
    const response = await fetch(apiURL + cityName + `&appid=${apiKey}`);
    const data = await response.json();

    console.log(data);

    const apicityName = document
      .querySelectorAll(".city")
      .forEach((element) => {
        element.innerHTML = data.name;
      });

    const apitemp = document.querySelectorAll(".temp").forEach((element) => {
      element.innerHTML = Math.round(data.main.temp) + "°C";
    });

    const apihumidity = document
      .querySelectorAll(".humidity")
      .forEach((element) => {
        element.innerHTML = data.main.humidity + "%";
      });

    const apiwind = document.querySelectorAll(".wind").forEach((element) => {
      element.innerHTML = data.wind.speed + " Km/h";
    });
  } catch (e) {
    console.log(e);
    alert("Error!");
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchCityName.value);
});
