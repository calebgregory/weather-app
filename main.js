// To see an example of the type of JSON file I am pulling from, see:
// http://api.wunderground.com/api/12b199f575226d1c/geolookup/conditions/forecast/q/37201.json

var API_URL = 'http://api.wunderground.com/api/12b199f575226d1c/geolookup/conditions/forecast10day/q/';
var lookup = document.querySelector('input[name = lookup]');
var curLoc = document.querySelector('input[name = current-location]');
var currentTempDisplay = document.querySelector('.current-temp-display');
var forecast = document.querySelector('.forecast');


function getJSON(url, cb) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      cb(JSON.parse(this.response));
    } else {
      errorResponse();
    }
  };

  xhr.send();
}

function changeData(data) {
  // if zip code does not exist or returns no data
  if (!data.current_observation) {
    errorResponse();
  } else {
    var currentDisplayHTML;
    var cityName = data.current_observation.display_location.full;
    currentDisplayHTML = '<h4>' + cityName + '</h4>';
    currentDisplayHTML += '<h1>Current Temperature:</h1>';
    var icon = data.current_observation.icon_url;
    currentDisplayHTML += '<div><img src="' + icon + '"></div>';
    var temp = data.current_observation.temp_f;
    currentDisplayHTML += '<h3>' + temp + 'ºF</h3>';

    currentTempDisplay.innerHTML = currentDisplayHTML;

    var forecastHTML = '';
    for (var i = 0; i < 5; i++) {
      var cellHTML = '<div class="cell">';
      var day = data.forecast.simpleforecast.forecastday[i].date.weekday;
      cellHTML += '<p>' + day + '</p>';
      var hi = data.forecast.simpleforecast.forecastday[i].high.fahrenheit;
      cellHTML += '<h2>' + hi + 'ºF</h2>';
      var icon = data.forecast.simpleforecast.forecastday[i].icon_url;
      cellHTML += '<img src="' + icon + '">';
      var lo = data.forecast.simpleforecast.forecastday[i].low.fahrenheit;
      cellHTML += '<h2>' + lo + 'ºF</h2>';
      cellHTML += '</div>';
      forecastHTML += cellHTML;
    }
    forecast.innerHTML = forecastHTML;
  }
}

// To see this in action, change the condition
// on line 16 to not equal 200 or type '99999'
// in the ZIP input form and hit 'Lookup'.
function errorResponse() {
  var errorHTML;
  errorHTML = '<h1>¡OH NOES!</h1>';
  var errorImg = 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-symbols-shapes/116331-magic-marker-icon-symbols-shapes-smileyfacesad.png';
  errorHTML += '<div><img src="' + errorImg + '"></div>';
  errorHTML += '<p>There appears to have been an error.</p>';
  errorHTML += '<p>Please enter another ZIP or try again.</p>';

  currentTempDisplay.innerHTML = errorHTML;
  forecast.innerHTML = '';
}

function getIpTemp() {
  getJSON(API_URL + 'autoip.json', changeData);
}

function getZipTemp(event) {
  var zip = document.querySelector('input[name = zipcode]').value;

  getJSON(API_URL + zip + '.json', changeData);
  event.preventDefault();
}

function getCurrentLocationTemp(event) {
	navigator.geolocation.getCurrentPosition(function (location) {

  	var lat = location.coords.latitude;
  	var long = location.coords.longitude;

 		getJSON(API_URL + lat + ',' + long + '.json', changeData);
	});

  event.preventDefault();
}

window.onload = getIpTemp;
lookup.onclick = getZipTemp;
curLoc.onclick = getCurrentLocationTemp;
