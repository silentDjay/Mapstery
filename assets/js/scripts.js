$(document).ready( function () {
  "use strict";

  var countryToClick;
  var countryToClickCode;
  var goalLatLng = {lat: "", lng: ""};
  var regionHint;
  var numBorderCountries;
  var borderCountryCodes = [];
  var borderCountryNames = [];
  var borderCountryList;
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
    success: function (allCountryData) {
        setUpCountry(allCountryData);
    }, error: function (request, error) {
        console.error(request);
    }
  });

  function setUpCountry(countriesDataArray) {
    var randCountryNum = Math.floor(Math.random() * (246 - 0 + 1)) + 0;
    countryToClickCode = countriesDataArray[randCountryNum].alpha2Code;
    countryToClick = countriesDataArray[randCountryNum].name;

    if (!countriesDataArray[randCountryNum].subregion) {
        regionHint = "the Antarctic";
    } else if (countriesDataArray[randCountryNum].subregion === "Caribbean") {
        regionHint = "the Caribbean";
    } else {
        regionHint = countriesDataArray[randCountryNum].subregion;
    }

    goalLatLng = {lat: countriesDataArray[randCountryNum].latlng[0], lng: countriesDataArray[randCountryNum].latlng[1]};
    numBorderCountries = countriesDataArray[randCountryNum].borders.length;
    borderCountryCodes = countriesDataArray[randCountryNum].borders;

    if (numBorderCountries === 0) {
    } else {
        //create arrays of border country names alpha2 country codes for the target country
        borderCountryCodes.forEach( function( BorderCountryAlpha3Code, index ) {
            countriesDataArray.forEach( function (country) {
                if (BorderCountryAlpha3Code === country.alpha3Code) {
                    borderCountryCodes.splice( index, 1, country.alpha2Code );
                    borderCountryNames.push( country.name );
                }
            });
        });
    }

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

    //get the latitude and longitude of a user's click
    google.maps.event.addListener(map, "click", function(event) {

        var MarkerWithLabel = require('markerwithlabel')(google.maps);

        function placeMarker(location, color) {
          markersLength = (markers.length + 1).toString();
          var markerLabel = markersLength + "<br>" + clickedCountryCode;

          var clickMarker = new MarkerWithLabel({
            position: location,
            map: map,
            labelContent: markerLabel,
            labelAnchor: new google.maps.Point(10, 50),
            labelClass: "labels", // the CSS class for the label
            labelInBackground: false,
            icon: pinSymbol(color)
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

        var clickedSpot = {position: event.latLng, map: map};
        var latitude = clickedSpot.position.lat();
        var longitude = clickedSpot.position.lng();

        var geocoder = new google.maps.Geocoder;
        var latlng = {lat: latitude, lng: longitude};

        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {

                function isCountryName(element) {
                    return element.types[0] === "country";
                };

                var countryIndex = results.findIndex(isCountryName);
                countryClicked = results[countryIndex].formatted_address;
                clickedCountryCode = results[countryIndex].address_components[0].short_name;

                if (clickedCountryCode === countryToClickCode) {
                    placeMarker(event.latLng, 'green');
                    victoryDisplay(countryToClick);
                } else {
                    $(".modal").modal('show');
                    $(".modal").html("You clicked on " + countryClicked);
                    placeMarker(event.latLng, 'red');

                    //determine the supplementary message to display upon click
                    if (numBorderCountries === 0) {
                        constructHint(markers.length, numBorderCountries);
                    } else {
                        var clickedBorderIndex = borderCountryCodes.indexOf(clickedCountryCode);

                        if (clickedBorderIndex === -1) {
                            constructHint(markers.length, numBorderCountries);
                        } else {
                            constructHint(markers.length, numBorderCountries, clickedBorderIndex);
                        }
                    }
                }
            } else {
                $(".modal").modal('show');
                $(".modal").html("Whoops! You clicked on unclaimed territory! <br> <p class='modalInstructions'>Try again!</p>");
            }

        });
    });
  }

  function constructHint(numClicks, borderCount, borderCountryClickedIndex) {
      if (borderCountryClickedIndex >= 0) {
        //slice() is used here to create a copy of the border country codes array without affecting the original array. Explanation here: http://stackoverflow.com/questions/6612385/why-does-changing-an-array-in-javascript-affect-copies-of-the-array
        var modifiedBorderCountryNames = borderCountryNames.slice();
        modifiedBorderCountryNames.splice(borderCountryClickedIndex, 1);
        constructBorderCountryList(modifiedBorderCountryNames);

        if (modifiedBorderCountryNames.length === 0) {
            $(".modal").append("<p class='modalInstructions'>So close! " + countryClicked + " is the only country that shares a border with " + countryToClick + "!");
        } else if (modifiedBorderCountryNames.length === 1) {
            $(".modal").append("<p class='modalInstructions'>Not too shabby! " + countryToClick + " shares a border with " + countryClicked + " and " + borderCountryList);
        } else {
            $(".modal").append("<p class='modalInstructions'>So close! " + countryToClick + " shares a border with " + countryClicked + ", as well as " + borderCountryList);
        }
      } else if (numClicks > 5) {

          if (borderCount === 0) {
              $(".modal").append("<p class='modalInstructions'>Hint: " + countryToClick + " is an island nation in " + regionHint + "</p>");
          } else {
              constructBorderCountryList(borderCountryNames);
              $(".modal").append("<p class='modalInstructions'>Hint: " + countryToClick + " is in " + regionHint + " and shares a border with " + borderCountryList);
          }
      } else {
          $(".modal").append("<p class='modalInstructions'>Try again!</p>");
      }
  };

  function constructBorderCountryList(countryNameArray) {
      if (countryNameArray.length === 1) {
          borderCountryList = countryNameArray[0];
      } else if (countryNameArray.length === 2) {
          borderCountryList = countryNameArray.join(" and ");
      } else {
          if (!countryNameArray[countryNameArray.length - 1].startsWith("and ")) {
              var lastCountry = countryNameArray.pop();
              countryNameArray.push("and " + lastCountry);
          }
          borderCountryList = countryNameArray.join(", ");
      }
  };

  function victoryDisplay(targetCountryName) {
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    $(".modal").modal('show');
    var msg = "";
    if (markers.length === 1) {
        msg = "You found "+ targetCountryName + " on the first try!"
    } else {
        msg = "You found " + targetCountryName + " after " + markers.length + " tries!"
    }
    $(".modal").html(msg + "<br>Awesome Job!<div class='modalInstructions'>Click anywhere to explore the map!</div>");
    $(".well").html("<a href='javascript:window.location.reload()'>Find a new country!</a>");
  };

  $(".well").click(function() {
      revealCountry();
  });

  function revealCountry() {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setCenter(goalLatLng);
      map.setZoom(6);
      $(".well").html("<a href='javascript:window.location.reload()'>Find a new country!</a>");
  }

  // function startNewRound() {
  //   map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
  //   resetMarkers();
  //   setUpCountry(countryList);
  // }

});
