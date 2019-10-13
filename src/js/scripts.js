var usStateData = require('./data/us-states');

$(document).ready(function () {
    "use strict";

    var potentialTargets;
    var selectedGameType;
    var windowWidth = $(window).width();

    var targetState;
    var stateClickedFullName;
    var stateMetadata = {
        capital: '',
        largest_city: '',
        population: null,
        nickname: ''
    };

    var targetCountryData;
    var countryToClickName;
    var countryToClickCode;
    var countryToClickFlag;
    var countryToClickArea;
    var goalLatLng = {lat: '', lng: ''};
    var regionHint;
    var numBorderCountries;
    var borderCountryCodes = [];
    var borderCountryNames = [];
    var borderCountryList;
    var clickedTerritoryCode;
    var countryClicked;
    var countryMetadata = {
        flag: '',
        population: null,
        demonym: '',
        capital: '',
        multiple_currencies: false,
        currencies: [],
        multiple_languages: false,
        languages: []
    };
    var mapRevealed = false;
    var previousMilesFromTarget;
    var clickDistanceHint;
    var countryRevealZoom;
    const exploreButtonMarkup =
      "<button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the Map</button>";
    const playAgainLinkMarkup =
      "<a href='javascript:window.location.reload()'>Play Mapstery Again</a>";

    /**
     * ask user to select which type of game they want to play
     */
    $("#countries_button").click(function () {
        initiateMapsteryGameplay('worldCountries');
    });
    $("#states_button").click(function () {
        initiateMapsteryGameplay('usStates');
    });
    $(".well").hide();
    $(".modal").modal('show');

    /**
     * initiate the map
     */
    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 42.29, lng: -85.585833},
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            disableDefaultUI: true,
            zoomControl: (windowWidth > 500 ? true : false),
            draggableCursor: 'crosshair',
            scaleControl: true,
        });

        //get the latitude and longitude of a user's click
        google.maps.event.addListener(map, "click", function (event) {

            var MarkerWithLabel = require('markerwithlabel')(google.maps);

            function placeMarker(location, color) {
                markersLength = (markers.length + 1).toString();
                var markerLabel = markersLength + "<br>" + clickedTerritoryCode;

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
            var clickedLatitude = clickedSpot.position.lat();
            var clickedLongitude = clickedSpot.position.lng();
            var distFromTargetCountry = calcLatLangDistance(goalLatLng.lat,
                goalLatLng.lng,
                clickedLatitude,
                clickedLongitude);

            var geocoder = new google.maps.Geocoder;
            var latlng = {lat: clickedLatitude, lng: clickedLongitude};

            function isStateName(element) {
                return element.types[0] === "administrative_area_level_1";
            }

            function isCountryName(element) {
                return element.types[0] === "country";
            }

            function isGeographicFeature(element) {
                return element.types.includes("natural_feature")
            }

            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results.find((element) => isGeographicFeature(element))) {
                        const feature = results.find((element) => isGeographicFeature(element));

                        $(".modal").modal('show');
                        $(".modal").html(`You clicked on ${feature.formatted_address.startsWith("Lake") ? `` : `the`} ` + feature.formatted_address +
                        "<div id='proceed_button' class='modalInstructions'>" +
                        "<button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button>" +
                        "</div>"
                        );

                    } else if (selectedGameType === 'worldCountries') {
                        var countryIndex = results.findIndex(isCountryName);

                        if (countryIndex === -1) {
                            resultsLoop:
                                for (var resultsIndex = (results.length - 1); resultsIndex >= 0; resultsIndex--) {
                                    for (var addressIndex = (results[resultsIndex].address_components.length - 1);
                                         addressIndex >= 0; addressIndex--) {
                                        if (isCountryName(results[resultsIndex].address_components[addressIndex])) {
                                            countryClicked = results[resultsIndex].address_components[addressIndex].long_name;
                                            clickedTerritoryCode = results[resultsIndex].address_components[addressIndex].short_name;
                                            break resultsLoop;
                                        }
                                    }
                                }
                        } else {
                            countryClicked = results[countryIndex].address_components[0].long_name;
                            clickedTerritoryCode = results[countryIndex].address_components[0].short_name;
                        }

                        if (mapRevealed === false) {
                            if (clickedTerritoryCode === countryToClickCode) {
                                placeMarker(event.latLng, 'green');
                                victoryDisplay(countryToClickName);
                            } else {
                                $(".modal").modal('show');
                                $(".modal").html("You clicked on " + countryClicked);
                                placeMarker(event.latLng, 'red');

                                //determine the supplementary message to display upon click
                                if (numBorderCountries === 0) {
                                    constructHint(mapRevealed, distFromTargetCountry,
                                        markers.length, numBorderCountries);
                                } else {
                                    var clickedBorderIndex = borderCountryCodes.indexOf(clickedTerritoryCode);

                                    if (clickedBorderIndex === -1) {
                                        constructHint(mapRevealed, distFromTargetCountry,
                                            markers.length, numBorderCountries);
                                    } else {
                                        constructHint(mapRevealed, distFromTargetCountry,
                                            markers.length, numBorderCountries,
                                            clickedBorderIndex);
                                    }
                                }
                            }
                        } else {
                            $(".modal").modal('show');
                            $(".modal").html("You clicked on " + countryClicked);
                            constructHint(mapRevealed);
                        }
                    } else if (selectedGameType === 'usStates') {
                        var stateIndex = results.findIndex(isStateName);

                        clickedTerritoryCode = results[stateIndex].address_components[0].short_name;
                        stateClickedFullName = results[stateIndex].address_components[0].long_name;

                        if (mapRevealed === false) {
                            if (targetState.abbr === clickedTerritoryCode) {
                                placeMarker(event.latLng, 'green');
                                victoryDisplay(stateClickedFullName);
                            } else {
                                $(".modal").modal('show');
                                $(".modal").html("You clicked on " + stateClickedFullName +
                                    "<div id='proceed_button' class='modalInstructions'>" +
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button>" +
                                    "</div>"
                                );
                                placeMarker(event.latLng, 'red');
                            }
                        } else {
                            $(".modal").modal('show');
                            $(".modal").html("You clicked on " + stateClickedFullName);
                            constructHint(mapRevealed);
                        }
                    }
                } else {
                    $(".modal").modal('show');
                    $(".modal").html("You clicked on unknown territory! " +
                        "<div id='proceed_button' class='modalInstructions'>" +
                        "<button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button>" +
                        "</div>"
                    );
                }

            });
        });
    };

    /**
     http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */

    function initiateMapsteryGameplay(gameType) {
        selectedGameType = gameType;
        if (gameType === 'worldCountries') {
            $.ajax({
                method: 'GET',
                url: 'https://restcountries.eu/rest/v2/all',
                data: {fields: "flag;name;alpha2Code;alpha3Code;capital;subregion;population;latlng;demonym;area;borders;languages;currencies"},
                success: function (allCountryData) {
                    potentialTargets = allCountryData;
                    setUpCountry(potentialTargets);
                    map.setOptions({
                        center: {
                            lat: 0,
                            lng: 0
                        }
                    });
                }, error: function (request, error) {
                    console.error(error);
                }
            });
        } else if (gameType === 'usStates') {
            // one potential alternative to storing US state data on the frontend
            // dataEndpoint = 'https://cors-anywhere.herokuapp.com/http://services.groupkt.com/state/get/USA/all';

            potentialTargets = usStateData;
            map.setOptions({
                zoom: (windowWidth > 500 ? 4 : 3),
                center: {
                    lat: 39.810556,
                    lng: -98.556111
                }
            });
            setUpState(potentialTargets);
        } else {
            alert("uh oh! Mapstery can't do that yet");
        }
    }

    function setUpState(statesDataArray) {
        var randStateNum = Math.floor(Math.random() * statesDataArray.length);
        targetState = statesDataArray[randStateNum];
        prepareStateMetadata(randStateNum);

        $(".modal").modal('show');
        $(".modal").html("Click on " + targetState.name +
            "<div id='proceed_button' class='modalInstructions'>" +
            "<button type='button' class='btn btn-primary' data-dismiss='modal'>Click to start playing</button></div>"
        );
        $(".well").show();
        $(".well").html("Click on " + targetState.name);
    }

    function setUpCountry(countriesDataArray) {
        var randCountryNum = Math.floor(Math.random() * countriesDataArray.length);
        targetCountryData = countriesDataArray[randCountryNum];
        countryToClickCode = targetCountryData.alpha2Code;
        countryToClickName = targetCountryData.name;
        countryToClickFlag = targetCountryData.flag;
        countryToClickArea = targetCountryData.area;

        // French Guiana and Svalbard and Jan Mayen have significant landmass, but no area data in restcountries
        if (countryToClickCode === "GF") {
            countryToClickArea = 83534;
        } else if (countryToClickCode === "SJ") {
            countryToClickArea = 61022;
        }

        countryRevealZoom = getZoomLevel(countryToClickArea, targetCountryData.latlng[0]);
        prepareCountryMetadata(randCountryNum);

        if (!targetCountryData.subregion) {
            regionHint = "the Antarctic";
        } else if (targetCountryData.subregion === "Caribbean") {
            regionHint = "the Caribbean";
        } else {
            regionHint = targetCountryData.subregion;
        }

        /* United States Minor Outlying Islands doesn't include latlng data in restcountries,
        so I'm just using the lat/lng data for its largest territory:
        https://en.wikipedia.org/wiki/Wake_Island
        */
        if (countryToClickCode === 'UM') {
            goalLatLng = {
                lat: 19.3,
                lng: 166.633333
            };
        } else {
            goalLatLng = {
                lat: targetCountryData.latlng[0],
                lng: targetCountryData.latlng[1]
            };
        }

        numBorderCountries = targetCountryData.borders.length;
        borderCountryCodes = targetCountryData.borders;

        if (numBorderCountries === 0) {
        } else {
            //create arrays of border country names alpha2 country codes for the target country
            borderCountryCodes.forEach(function (BorderCountryAlpha3Code, index) {
                countriesDataArray.forEach(function (country) {
                    if (BorderCountryAlpha3Code === country.alpha3Code) {
                        borderCountryCodes.splice(index, 1, country.alpha2Code);
                        borderCountryNames.push(country.name);
                    }
                });
            });
        }

        $(".modal").modal('show');
        $(".modal").html("Click on " + countryToClickName +
            "<img class='targetFlag' src=" + countryToClickFlag + "></img>" +
            "<div id='proceed_button' class='modalInstructions'>" +
            "<button type='button' class='btn btn-primary' data-dismiss='modal'>Click to start playing</button></div>"
        );
        $(".well").show();
        $(".well").html("Click on " + countryToClickName +
            "<img class='targetFlagWell' src=" + countryToClickFlag + "></img>" +
            "<div id='reveal-country'>Or click here to reveal " + countryToClickName + "</div>");
    }

    /* this stackoverflow helped me get my google maps call working:
    http://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load
    */

    var map;
    var markers = [];
    var markersLength;

    /*I got this function from here:
    http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    */
    function calcLatLangDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        var km = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        var mi = km * 0.621371;
        var isCloser;

        if (typeof previousMilesFromTarget === "number") {
            isCloser = previousMilesFromTarget > mi;
        }

        previousMilesFromTarget = mi;
        return {
            'miles': makeNumbersPretty(mi),
            'kilometers': makeNumbersPretty(km),
            'closerClick': isCloser
        };
    }

    function makeNumbersPretty(uglyNumber) {
        uglyNumber = Math.round(uglyNumber);
        var uglyNumberRevString = uglyNumber.toString().split("").reverse();
        for (var i = 3; i < uglyNumberRevString.length; i = i + 4) {
            uglyNumberRevString.splice(i, 0, ',');
        }
        return uglyNumberRevString.reverse().join("");
    }

    function constructHint(isMapRevealed, distFromTarget, numClicks,
                           borderCount, borderCountryClickedIndex) {
        if (isMapRevealed === false) {

            if (distFromTarget.closerClick === true) {
                clickDistanceHint = "You're getting warmer!";
            } else if (distFromTarget.closerClick === false) {
                clickDistanceHint = "You're getting colder."
            } else {
                clickDistanceHint = "";
            }

            $(".modal").append("<p class='modalInstructions'>" +
                clickDistanceHint + " Your click was about " + distFromTarget.miles +
                " Miles (" + distFromTarget.kilometers + " Kilometers) from " +
                countryToClickName + "<div id='proceed_button' class='modalInstructions'>" +
                "<button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button>" +
                "</div>"
            );
            if (borderCountryClickedIndex >= 0) {
                /*slice() is used here to create a copy of the border country codes array
                without affecting the original array.
                Explanation here:
                http://stackoverflow.com/questions/6612385/why-does-changing-an-array-in-javascript-affect-copies-of-the-array
                */
                var modifiedBorderCountryNames = borderCountryNames.slice();
                modifiedBorderCountryNames.splice(borderCountryClickedIndex, 1);
                constructBorderCountryList(modifiedBorderCountryNames);

                if (modifiedBorderCountryNames.length === 0) {
                    $(".modal").append("<p class='modalInstructions'>" +
                        countryClicked + " is the only country that shares a border with " +
                        countryToClickName + "!");
                } else if (modifiedBorderCountryNames.length === 1) {
                    $(".modal").append("<p class='modalInstructions'>" +
                        countryToClickName + " shares a border with " + countryClicked + " and " +
                        borderCountryList);
                } else {
                    $(".modal").append("<p class='modalInstructions'>" +
                        countryToClickName + " shares a border with " + countryClicked +
                        ", as well as " + borderCountryList);
                }
            } else if (numClicks > 5) {

                if (borderCount === 0) {
                    $(".modal").append("<p class='modalInstructions'>" +
                        "Hint: " + countryToClickName + " is an island nation in " +
                        regionHint + "</p>");
                } else {
                    constructBorderCountryList(borderCountryNames);
                    $(".modal").append("<p class='modalInstructions'>" +
                        "Hint: " + countryToClickName + " is in " + regionHint +
                        " and shares a border with " + borderCountryList);
                }
            }
        } else {
            if (selectedGameType === 'worldCountries'){
                var clickedCountryIndex = potentialTargets.findIndex(getClickedCountryIndex);
                prepareCountryMetadata(clickedCountryIndex);
                $(".modal").append(countryMetadataMarkup());
            } else if (selectedGameType === 'usStates') {
                var clickedStateIndex = potentialTargets.findIndex(getClickedStateIndex);
                if (clickedStateIndex != -1) {
                    prepareStateMetadata(clickedStateIndex);
                    $(".modal").append(stateMetadataMarkup());
                } else {
                    $(".modal").append("<p class='modalInstructions'>" + exploreButtonMarkup + "</p>");
                }

            }

        }
    }

    function constructBorderCountryList(countryNameArray) {
        if (countryNameArray.length === 0) {
        } else if (countryNameArray.length === 1) {
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
    }

    function constructLanguagesList(rawLanguages) {
      const languagesList = [];
      rawLanguages.forEach(function (language) {
        if (language.name) languagesList.push(language.name);
      });
      return languagesList.join(', ');
    }

    function constructCurrenciesList(rawCurrencies) {
      const currenciesList = [];
      rawCurrencies.forEach(function (currency) {
        if (currency.name) {
          currenciesList.push(currency.name + (currency.symbol ? ' (' + currency.symbol + ')' : ''));
        }
      });
      return currenciesList.join(', ');
    }

    function victoryDisplay(targetCountryName) {
        map.setOptions({
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
            zoomControl: windowWidth > 500,
            streetViewControl: false,
            fullscreenControl: false
        });
        $(".modal").modal('show');
        var msg = "";
        if (markers.length === 1) {
            msg = "Fantastic! You found " + targetCountryName + " on the first try!"
        } else {
            msg = "You found " + targetCountryName + " after " + markers.length + " tries!"
        }

        mapRevealed = true;

        if (selectedGameType === 'worldCountries') {
            $(".modal").html(msg + countryMetadataMarkup());
            $(".well").html(playAgainLinkMarkup);
        } else if (selectedGameType === 'usStates') {
            $(".modal").html(msg + stateMetadataMarkup());
            $(".well").html(playAgainLinkMarkup);
        }
    }

    function getZoomLevel(countryArea, countryLatitude) {
        var zoomLevel = 0;

        switch (true) {
            case isNaN(countryArea):
                zoomLevel = 8;
                break;
            case countryArea > 9700000:
                zoomLevel = 3;
                break;
            case countryArea > 7500000:
                zoomLevel = 4;
                break;
            case countryArea > 250000:
                zoomLevel = 5;
                break;
            case countryArea > 40000:
                zoomLevel = 6;
                break;
            case countryArea > 1000:
                zoomLevel = 7;
                break;
            case countryArea > 10:
                zoomLevel = 8;
                break;
            case countryArea > 3:
                zoomLevel = 9;
                break;
            default:
                zoomLevel = 12;
        }

        // arctic countries in the northern hemisphere are much larger than they appear
        zoomLevel -= countryLatitude > 70 ? 2 : 0;

        return zoomLevel;
    }

    function revealCountry(zoomLevel) {
        map.setOptions({
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
            zoomControl: (windowWidth > 500),
            streetViewControl: false,
            fullscreenControl: false,
            zoom: zoomLevel,
            center: goalLatLng
        });
        mapRevealed = true;
        $(".well").html(playAgainLinkMarkup);
    }

    function prepareCountryMetadata(countryIndex) {
        const country = potentialTargets[countryIndex];
        countryMetadata = {
            flag: country.flag,
            population: makeNumbersPretty(country.population),
            demonym: country.demonym,
            capital: country.capital,
            multiple_currencies: country.currencies.length > 1,
            currencies: constructCurrenciesList(country.currencies),
            multiple_languages: country.languages.length > 1,
            languages: constructLanguagesList(country.languages)
        }
    }

    function countryMetadataMarkup() {
      return "<p class='modalInstructions'>" +
      "<img class='bonusCountryFlag' src=" + countryMetadata.flag + "></img><br>" +
      "Population: " + countryMetadata.population + "<br>" +
      (countryMetadata.capital ? "Capital City: " + countryMetadata.capital + "<br>" : "") +
      (countryMetadata.demonym ? "Demonym: " + countryMetadata.demonym + "<br>" : "") +
      (countryMetadata.multiple_currencies ? 'Currencies: ' : 'Currency: ') +
      countryMetadata.currencies + "<br>" +
      (countryMetadata.multiple_languages ? 'Languages: ' : 'Language: ') +
      countryMetadata.languages + "<br>" +
      exploreButtonMarkup + "</p>"
    }

    function prepareStateMetadata(stateIndex) {
        const state = potentialTargets[stateIndex];
        stateMetadata = {
          largest_city: state.largest_city,
          capital: state.capital,
          population: makeNumbersPretty(state.population),
          nickname: state.nickname
        }
    }

    function stateMetadataMarkup() {
      return "<div class='modalInstructions'>" +
      "Population: " + stateMetadata.population + "<br>" +
      (stateMetadata.capital ? "Capital City: " + stateMetadata.capital + "<br>" : "") +
      "Largest City: " + stateMetadata.largest_city + "<br>" +
      "Nickname: " + stateMetadata.nickname + "<br>" +
      exploreButtonMarkup + "</div>"
    }

    function getClickedCountryIndex(allCountries) {
        return allCountries.alpha2Code === clickedTerritoryCode;
    }

    function getClickedStateIndex(allStates) {
        return allStates.abbr === clickedTerritoryCode;
    }

    $(".well").click(function () {
        if (selectedGameType === 'worldCountries') {
            revealCountry(countryRevealZoom);
        }
    });

});
