const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoText = inputPart.querySelector(".info-text");
const inputText = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const weatherIcon = document.querySelector(".weather-part img");
const arrowBackIcon = wrapper.querySelector("header i");

let api;

inputText.addEventListener("keyup", function (event) {
  // if user pressed enter button and input value is not empty
  if (event.key == "Enter" && inputText.value != "") {
    requestAPI(inputText.value);
  }
});

locationBtn.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function onSuccess(position) {
  // getting latitude and longitude of the user device from coords object
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ef871b625669e2812b44cede43aca621`;
  fetchData();
}

function onError(error) {
  infoText.innerText = error.message;
  infoText.classList.add("error");
}

function requestAPI(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ef871b625669e2812b44cede43aca621`;
  fetchData();
}

function fetchData() {
  infoText.innerText = "Getting weather details...";
  infoText.classList.add("pending");

  // getting api response and returning it with parsing into javascript object
  // then function calling weatherDetails function with passing api result as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoText.classList.replace("pending", "error");
    infoText.innerText = `${inputText.value} isn't a valid city name`;
  } else {
    // get required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      weatherIcon.src = "weather-icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "weather-icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "weather-icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "weather-icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "weather-icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "weather-icons/rain.svg";
    }

    // pass the values to html elements
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .number").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".temp .number-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}

arrowBackIcon.addEventListener("click", function () {
  wrapper.classList.remove("active");
});
