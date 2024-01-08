const apiKey = "8810174c582fbbc07decb8ad688836dd";
const apiURLCityName =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiURLCoords =
  "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchCityNameInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const searchBtnCoords = document.querySelector("#find-me");

// visible dettails information
const cityContainer = document.querySelector(".city");
const hoursContainer = document.querySelector(".hours");
const weatherContainer = document.querySelector(".weather");
const detailsContainer = document.querySelector(".details");

async function checkWeather(cityName) {
  try {
    const response = await fetch(
      apiURLCityName + cityName + `&appid=${apiKey}`
    );

    const data = await response.json();

    displayData(data);
  } catch (e) {
    console.log(e);
    alert("Error!");
  }
}

async function checkWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      apiURLCoords + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`
    );

    const data = await response.json();

    displayData(data);
  } catch (e) {
    console.log(e);
    alert("Error!");
  }
}

function displayData(data) {
  document.querySelector(".lat").innerHTML = `Latitude ${data.coord.lat}`;
  document.querySelector(".lon").innerHTML = `Longitude ${data.coord.lon}`;

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".date").innerHTML = displayCurrentDate();
  document.querySelector(".sunrise").innerHTML = convertTimestamp(
    data.sys.sunrise,
    data.timezone
  );

  document.querySelector(".sunset").innerHTML = convertTimestamp(
    data.sys.sunset,
    data.timezone
  );

  if (data.weather[0].description) {
    document.querySelector(".description").innerHTML =
      data.weather[0].description;
  } else {
    console.log("Weather description not available");
  }

  document.querySelector(".temp").innerHTML = `${parseInt(
    data.main.temp
  )}<span>°C</span>`;
  document.querySelector(".tempFeel").innerHTML = `Feels like: ${parseInt(
    data.main.feels_like
  )}<span>°C</span>`;

  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";
  document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";

  cityContainer.classList.remove("open");
  hoursContainer.classList.remove("open");
  weatherContainer.classList.remove("open");
  detailsContainer.classList.remove("open");

  // add visible details with flip transition class
  setTimeout(() => {
    cityContainer.classList.add("open");
    hoursContainer.classList.add("open");
    weatherContainer.classList.add("open");
    detailsContainer.classList.add("open");
  }, 10);

  switch (data.weather[0].main) {
    case "Clear":
      weatherIcon.src = "images/clear.png";
      break;
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      break;
    case "Rain":
      weatherIcon.src = "images/rain.png";
      break;
    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "images/mist.png";
      break;
    case "Snow":
      weatherIcon.src = "images/snow.png";
      break;
  }
}

function searchCityName() {
  const cityName = searchCityNameInput.value;

  if (cityName != "") {
    checkWeather(cityName);
    searchCityNameInput.value = "";
  } else {
    alert("Please write correct city name");
  }
}

function convertTimestamp(timestamp, timezone) {
  let date = new Date((timestamp + timezone) * 1000);
  let hours = date.getUTCHours();
  let minutes = date.getMinutes();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let formattedTime = `${hours} : ${minutes}`;
  return formattedTime;
}

function displayCurrentDate() {
  let currentDate = new Date();

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let formattedDate = currentDate.toLocaleDateString("en-US", options);

  return formattedDate;
}

function showTime() {
  let date = new Date();
  let H = date.getHours();
  let m = date.getMinutes();

  H = H < 10 ? "0" + H : H;
  m = m < 10 ? "0" + m : m;

  let time = H + ":" + m;

  document.querySelector(".hour").innerText = time;
  document.querySelector(".hour").textContent = time;
}

function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    checkWeatherByCoords(latitude, longitude);
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

showTime();

searchBtn.addEventListener("click", searchCityName);

searchCityNameInput.addEventListener("keypress", function (pressedKey) {
  if (pressedKey.key === "Enter") {
    searchCityName();
  }
});

searchBtnCoords.addEventListener("click", (event) => {
  geoFindMe();
});
