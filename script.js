const temp = document.querySelector('#temp'),
  date = document.querySelector('#date-time'),
  currentLocation = document.querySelector('#location'),
  condition = document.querySelector('#condition'),
  rain = document.getElementById('rain'),
  mainIcon = document.getElementById('icon'),
  uvIndex = document.querySelector('.uv-index'),
  uvText = document.querySelector('.uv-text'),
  windSpeed = document.querySelector('.wind-speed'),
  sunRise = document.querySelector('.sun-rise'),
  sunSet = document.querySelector('.sun-set'),
  humidity = document.querySelector('.humidity'),
  visibilty = document.querySelector('.visibilty'),
  humidityStatus = document.querySelector('.humidity-status'),
  airQuality = document.querySelector('.air-quality'),
  airQualityStatus = document.querySelector('.air-quality-status'),
  weatherCards = document.querySelector('#weather-cards'),
  visibilityStatus = document.querySelector('.visibilty-status'),
  celciusBtn = document.querySelector('.celcius'),
  fahrenheitBtn = document.querySelector('.fahrenheit'),
  searchForm = document.querySelector('#idsearch'),
  search = document.querySelector('#query');
const tempUnit = document.querySelectorAll('#temp-unit');
let currentCity = ''; // delhi
let currentUnit = 'c';

// update date time

function getDateTime() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  // console.log(now);
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thrusday',
    'Friday',
    'Saturday',
  ];

  // 24 hours to 12 hours time
  hour = hour % 12;
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  let dayName = days[now.getDay()];
  return `${dayName}, ${hour}:${minute}`;
}
// update time every second
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);

// function to get public ip address
function getPublicIp() {
  fetch('https://geolocation-db.com/json/', {
    method: 'GET',
    headers: {},
  })
    .then((response) => response.json())
    .then((data) => {
      currentCity = data.city;

      // console.log(data);
      getWeatherData(data.city, currentUnit);
    })
    .catch((err) => {
      console.error(err);
    });
}

getPublicIp();

// function to get weather data
function getWeatherData(city, unit) {
  const apiKey = '86CL65UL8UJRSQFVZP95ACSXJ';
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
      method: 'GET',
      headers: {},
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      let today = data.currentConditions;
      if (unit === 'c') {
        temp.innerText = today.temp;
      } else {
        temp.innerText = celciusToFahrenheit(today.temp);
      }
      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.condition;
      rain.innerText = 'Perc - ' + today.precip + '%';
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;
      measureUvIndex(today.uvindex);
      mainIcon.src = getIcon(today.icon);
      humidity.innerText = today.humidity + '%';
      updateHumidityStatus(today.humidity);
      visibilty.innerText = today.visibility;
      updateVisibiltyStatus(today.visibility);
      airQuality.innerText = today.winddir;
      updateAirQualityStatus(today.winddir);
      updateForecast(data.days, unit);
      sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
      sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
    });
}

// function to conver celcius to fahrenheit
function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}

// function to get uv index status
function measureUvIndex(uvIndex) {
  if (uvIndex <= 2) {
    uvText.innerText = 'Low';
  } else if (uvIndex <= 5) {
    uvText.innerText = 'Moderate';
  } else if (uvIndex <= 7) {
    uvText.innerText = 'High';
  } else if (uvIndex <= 10) {
    uvText.innerText = 'Very High';
  } else {
    uvText.innerText = 'Extreme';
  }
}

// function to get humidity status
function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = 'Low';
  } else if (humidity <= 60) {
    humidityStatus.innerText = 'Moderate';
  } else {
    humidityStatus.innerText = 'High';
  }
}

// function to get visibility status
function updateVisibiltyStatus(visibility) {
  if (visibility <= 0.03) {
    visibilityStatus.innerText = 'Dense Fog';
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = 'Moderate Fog';
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = 'Light Fog';
  } else if (visibility <= 1.13) {
    visibilityStatus.innerText = 'Very Light Fog';
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = 'Light Mist';
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = 'Very Light Mist';
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = 'Clear Air';
  } else {
    visibilityStatus.innerText = 'Very Clear Air';
  }
}

// function to get air quality status
function updateAirQualityStatus(airquality) {
  if (airquality <= 50) {
    airQualityStatus.innerText = 'Good????';
  } else if (airquality <= 100) {
    airQualityStatus.innerText = 'Moderate????';
  } else if (airquality <= 150) {
    airQualityStatus.innerText = 'Unhealthy for Sensitive Groups????';
  } else if (airquality <= 200) {
    airQualityStatus.innerText = 'Unhealthy????';
  } else if (airquality <= 250) {
    airQualityStatus.innerText = 'Very Unhealthy????';
  } else {
    airQualityStatus.innerText = 'Hazardous????';
  }
}
function getIcon(condition) {
  if (condition === 'partly-cloudy-day') {
    return '/img/cloudy-day.png';
  } else if (condition === 'partly-cloudy-night') {
    return '/img/cloudy-night.png';
  } else if (condition === 'rain') {
    return '/img/rainy-day.png';
  } else if (condition === 'clear-day') {
    return '/img/sun.png';
  } else if (condition === 'clear-night') {
    return '/img/clear-night.png';
  } else {
    return '/img/default.png';
  }
}

// convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
  let hour = time.split(':')[0];
  let min = time.split(':')[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}

// update forcast
function updateForecast(data, unit) {
  weatherCards.innerHTML = '';
  let day = 0;
  let numCards = 7;

  for (let i = 0; i < numCards; i++) {
    let card = document.createElement('div');
    card.classList.add('card');

    // console.log(data[day].datetime);

    let dayName = getDayName(data[day].datetime);

    let dayTemp = data[day].temp;
    if (unit === 'f') {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = '??C';
    if (unit === 'f') {
      tempUnit = '??F';
    }
    card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" width="60px" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
    weatherCards.appendChild(card);
    day++;
  }
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    // console.log(day.getDay())
  ];
  return days[day.getDay()];
}

fahrenheitBtn.addEventListener('click', () => {
  changeUnit('f');
});
celciusBtn.addEventListener('click', () => {
  changeUnit('c');
});
// function to change unit
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;

    tempUnit.forEach((elem) => {
      elem.innerText = `??${unit.toUpperCase()}`;
    });
    if (unit === 'c') {
      celciusBtn.classList.add('active');
      fahrenheitBtn.classList.remove('active');
    } else {
      celciusBtn.classList.remove('active');
      fahrenheitBtn.classList.add('active');
    }

    getWeatherData(currentCity, currentUnit);
  }
}

// function to handle search form
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(location, currentUnit);
  }
  search.value = '';
});
