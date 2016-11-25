$(document).ready( function () {
  "use strict";

  var countryToClick;
  var countryToClickCode;
  var continentToClick;
  var countryList = [];
  var regionHint;
  var goalLatLng = {lat: "", lng: ""};
  var borderCountries = {};
  var numBorderCountries;
  var clickedCountryCode;
  var countryClicked;

  /**
  http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  * Returns a random integer between min (inclusive) and max (inclusive)
  * Using Math.round() will give you a non-uniform distribution!
  */

  $.ajax({
    method: 'GET',
    url: 'https://restcountries.eu/rest/v1/all',
    success: function (data) {
      countryList = data;
      setupCountry(countryList);
    }, error: function (request,error) {
      console.error(request);
    }
  });

  function setupCountry(data) {
    var randCountryNum = Math.floor(Math.random() * (246 - 0 + 1)) + 0;
    countryToClickCode = data[randCountryNum].alpha2Code;
    countryToClick = data[randCountryNum].name;
    continentToClick = data[randCountryNum];
    regionHint = data[randCountryNum].subregion;
    goalLatLng = {lat: data[randCountryNum].latlng[0], lng: data[randCountryNum].latlng[1]};
    numBorderCountries = data[randCountryNum].borders.length;
    $(".modal").modal('show');
    $(".modal").html("Click on " + countryToClick + "<div class='modalInstructions'>(Click anywhere to start)</div>");
    $(".well").html("Click on " + countryToClick + "<div id='reveal-country'>Or click here to reveal " + countryToClick + "</div>");
  }

// this stackoverflow helped me get my google maps call working: http://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load

  var map;
  var markers = [];
  var markersLength;

  function resetMarkers() {
    for (var i=0;i<markers.length;i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.29, lng: -85.585833},
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoomControl: true,
      draggableCursor: 'crosshair'
    });

    //this gets the latitude and longitude of a user's click
    google.maps.event.addListener(map, "click", function(event) {

    var MarkerWithLabel = require('markerwithlabel')(google.maps);

    function placeMarker(location) {
      markersLength = (markers.length + 1).toString();
      var markerLabel = markersLength + "<br>" + clickedCountryCode;

      var clickMarker = new MarkerWithLabel({
        position: location,
        map: map,
        labelContent: markerLabel,
        labelAnchor: new google.maps.Point(10, 50),
        labelClass: "labels", // the CSS class for the label
        labelInBackground: false,
        icon: pinSymbol('red')
      });

      markers.push(clickMarker);
    }

    function pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 1.5
        };
    }

    //create an object with the clickevent's latlng information within it
    var clickedSpot = {position: event.latLng, map: map};
    //fetch the latitude of the click
    var latitude = clickedSpot.position.lat();
    //fetch the longitude of the click
    var longitude = clickedSpot.position.lng();

    //this function below gets the country name based on the latLng coordinates of the click
    // this documentation provided all of my answers: https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

      var geocoder = new google.maps.Geocoder;
      var latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({'location': latlng}, function(results, status) {
        console.info(results);
        if (status === google.maps.GeocoderStatus.OK) {
          for (var i=0; i < results.length; i++){
            if (results[i].types[0] === "country"){
              countryClicked = results[i].formatted_address;
              clickedCountryCode = results[i].address_components[0].short_name;
              if (clickedCountryCode === countryToClickCode){
                placeMarker(event.latLng);
                victoryDisplay(countryClicked);
              } else {
                placeMarker(event.latLng);
                $(".modal").modal('show');
                $(".modal").html("You clicked on " + countryClicked + "<br>Try again!");
                if (markers.length > 5) {
                    if (numBorderCountries === 0) {
                        $(".modal").append("<p class='modalInstructions'>Hint: " + countryToClick + " is an island nation in " + regionHint + "</p>");
                    } else if (numBorderCountries === 1) {
                        $(".modal").append("<p class='modalInstructions'>Hint: " + countryToClick + " is in " + regionHint + " and borders " + numBorderCountries  + " country</p>");
                    } else  {
                        $(".modal").append("<p class='modalInstructions'>Hint: " + countryToClick + " is in " + regionHint + " and borders " + numBorderCountries  + " countries</p>");
                    }
                }
              }
            } else {
              // do nothing - this level of results[i] does not contain the country name
            }
          }
        } else {
          $(".modal").modal('show');
          $(".modal").html("Whoops! You clicked on unclaimed territory! <br>Try again!");
        }

      });

    });

  }

  function victoryDisplay(countryClicked) {
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    $(".modal").modal('show');
    var msg = "";
    if (markers.length === 1) {
      msg = "You got "+ countryClicked + " on the first try!"
    } else {
      msg = "You clicked on " + countryClicked + " after "+ markers.length +" tries!"
    }
    $(".modal").html(msg + "<br>Awesome Job!<div class='modalInstructions'>Click anywhere to see all your clicks!</div>");
    $(".well").html("<div class='well'><a href='javascript:window.location.reload();'>Find a new country!</a></div>");
  }

  $(".well").click(function() {
      revealCountry();
  });

  function revealCountry() {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setCenter(goalLatLng);
      map.setZoom(6);
      $(".well").html("<div class='well'><a href='javascript:window.location.reload();'>Find a new country!</a></div>");
  }

  // function startNewRound() {
  //   map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
  //   resetMarkers();
  //   setupCountry(countryList);
  // }

});
