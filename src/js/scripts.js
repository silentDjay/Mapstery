var usStateData = require('./data/us-states');

$(document).ready(function () {
    "use strict";

    var potentialTargets;
    var selectedGameType;
    var windowWidth = $(window).width();

    var targetState;
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
    var clickedCountryIndex;
    var clickedStateIndex;
    var countryMetadata = {
        flags: {},
        population: null,
        demonym: {},
        capitals: [],
        currencies: {},
        languages: {},
        drivingSide: null
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
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            disableDefaultUI: true,
            zoomControl: (windowWidth > 500 ? true : false),
            draggableCursor: 'crosshair',
            scaleControl: true,
        });

        //get the latitude and longitude of a user's click
        google.maps.event.addListener(map, "click", function (event) {

            var MarkerWithLabel = require('markerwithlabel')(google.maps);

            function placeMarker(location, color, labelText) {
                markersLength = (markers.length + 1).toString();
                var markerLabel = markersLength + "<br>" + labelText;

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

            var geocoder = new google.maps.Geocoder();
            var latlng = {lat: clickedLatitude, lng: clickedLongitude};

            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status !== google.maps.GeocoderStatus.OK) {
                    $(".modal").modal('show');
                    $(".modal").html("You clicked on unknown territory! " +
                        "<div id='proceed_button' class='modalInstructions'>" +
                        "<button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button>" +
                        "</div>"
                    );
                } else {
                    const clickLocationData = {};
                    results.forEach(result => {
                        if (result.types.includes("natural_feature")) {
                            clickLocationData.natural_feature = result.address_components[0].long_name;
                        } else if (result.types.includes("administrative_area_level_1")) {
                            clickLocationData.state = {
                                name: result.address_components[0].long_name,
                                code: result.address_components[0].short_name.substring(0, 2)
                            };
                            if (selectedGameType === 'usStates') clickedStateIndex = getClickedTerritoryIndex(selectedGameType, clickLocationData.state.code);
                        } else if (result.types.includes("country")) {
                            clickLocationData.country = {
                                name: result.address_components[0].long_name,
                                code: result.address_components[0].short_name
                            };
                            if (selectedGameType === 'worldCountries') clickedCountryIndex = getClickedTerritoryIndex(selectedGameType, clickLocationData.country.code);
                        }
                    });
                    
                    if (selectedGameType === 'worldCountries' && clickLocationData.country) {
                        if (mapRevealed === false) {
                            if (clickLocationData.country.code === countryToClickCode) {
                                placeMarker(event.latLng, 'green', clickLocationData.country.code);
                                victoryDisplay(countryToClickName);
                            } else {
                                $(".modal").modal('show');
                                $(".modal").html("You clicked on " + clickLocationData.country.name);
                                placeMarker(event.latLng, 'red', clickLocationData.country.code);

                                //determine the supplementary message to display upon click
                                if (numBorderCountries === 0) {
                                    constructHint(mapRevealed, distFromTargetCountry,
                                        markers.length, numBorderCountries);
                                } else {
                                    var clickedBorderIndex = borderCountryCodes.indexOf(clickLocationData.country.code);

                                    if (clickedBorderIndex === -1) {
                                        constructHint(mapRevealed, distFromTargetCountry,
                                            markers.length, numBorderCountries);
                                    } else {
                                        constructHint(mapRevealed, distFromTargetCountry,
                                            markers.length, numBorderCountries,
                                            clickedBorderIndex, clickLocationData.country.name);
                                    }
                                }
                            }
                        } else {
                            $(".modal").modal('show');
                            $(".modal").html("You clicked on " + clickLocationData.country.name);
                            constructHint(mapRevealed);
                        }
                    } else if (selectedGameType === 'usStates' && clickLocationData.state) {
                        if (mapRevealed === false) {
                            if (targetState.abbr === clickLocationData.state.code && clickLocationData.country.code === "US") {
                                placeMarker(event.latLng, 'green', clickLocationData.state.code);
                                victoryDisplay(clickLocationData.state.name);
                            } else {
                                $(".modal").modal('show');
                                $(".modal").html("You clicked on " + 
                                    `${clickLocationData.state.name ? `${clickLocationData.state.name}` : ''}` + 
                                    `${clickLocationData.country.code !== "US" ? `, ${clickLocationData.country.name}` : ''}` +
                                    "<div id='proceed_button' class='modalInstructions'>" +
                                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>Try Again</button>" +
                                    "</div>"
                                );
                                placeMarker(event.latLng, 'red', clickLocationData.state.code);
                            }
                        } else {
                            $(".modal").modal('show');
                            $(".modal").html("You clicked on " + 
                                `${clickLocationData.state.name ? `${clickLocationData.state.name},` : ''} ${clickLocationData.country.name}` 
                            );
                            constructHint(mapRevealed);
                        }
                    } else if (clickLocationData.natural_feature) {
                        $(".modal").modal('show');
                        $(".modal").html(`You clicked on ${clickLocationData.natural_feature.startsWith("Lake") ? `` : `the`} ${clickLocationData.natural_feature}` +
                            "<div id='proceed_button' class='modalInstructions'>" +
                            `<button type='button' class='btn btn-primary' data-dismiss='modal'>${mapRevealed ? 'Continue' : 'Try Again'}</button>` +
                            "</div>"
                        );
                    }
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
                url: 'https://restcountries.com/v3.1/all',
                data: {fields: "flags,name,cca2,cca3,capital,subregion,population,latlng,demonyms,area,borders,landlocked,languages,currencies,car"},
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
        countryToClickCode = targetCountryData.cca2;
        countryToClickName = targetCountryData.name.common;
        countryToClickFlag = targetCountryData.flags.svg;
        countryToClickArea = targetCountryData.area;

        // Svalbard and Jan Mayen has significant landmass, but no area data in the API
        if (countryToClickCode === "SJ") {
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

        goalLatLng = {
            lat: targetCountryData.latlng[0],
            lng: targetCountryData.latlng[1]
        };

        numBorderCountries = targetCountryData.borders.length;
        borderCountryCodes = targetCountryData.borders;

        if (numBorderCountries === 0) {
        } else {
            //create arrays of border country names by alpha2 country codes for the target country
            borderCountryCodes.forEach(function (BorderCountryAlpha3Code, index) {
                countriesDataArray.forEach(function (country) {
                    if (BorderCountryAlpha3Code === country.cca3) {
                        borderCountryCodes.splice(index, 1, country.cca2);
                        borderCountryNames.push(country.name.common);
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
                           borderCount, borderCountryClickedIndex, clickedCountryName) {
        if (isMapRevealed === false) {

            clickDistanceHint = `You're getting ${!!distFromTarget.closerClick ? `warmer!` : `colder.`}`;

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
                        clickedCountryName + " is the only country that shares a border with " +
                        countryToClickName + "!");
                } else if (modifiedBorderCountryNames.length === 1) {
                    $(".modal").append("<p class='modalInstructions'>" +
                        countryToClickName + " shares a border with " + clickedCountryName + " and " +
                        borderCountryList);
                } else {
                    $(".modal").append("<p class='modalInstructions'>" +
                        countryToClickName + " shares a border with " + clickedCountryName +
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
                        "Hint: " + countryToClickName + " is " +
                        (targetCountryData.landlocked ? "a landlocked country " : "") +
                        "in " + regionHint +
                        " and shares a border with " + borderCountryList + "</p>");
                }
            }
        } else {
            if (selectedGameType === 'worldCountries'){
                prepareCountryMetadata(clickedCountryIndex);
                $(".modal").append(countryMetadataMarkup());
            } else if (selectedGameType === 'usStates') {
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
      for( const language of Object.values(rawLanguages)) {
        languagesList.push(language);
      };
      return languagesList.join(', ');
    }

    function constructCurrenciesList(rawCurrencies) {
      const currenciesList = [];
      for( const currency of Object.values(rawCurrencies)) {
          currenciesList.push(`${currency.name} (${currency.symbol})`);
      };
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
            flag: country.flags.svg,
            population: makeNumbersPretty(country.population),
            demonym: country.demonyms.eng.f,
            capitals: country.capital,
            currencies: constructCurrenciesList(country.currencies),
            languages: constructLanguagesList(country.languages),
            drivingSide: `${country.car.side[0].toUpperCase()}${country.car.side.slice(1)}`
        }
    }

    function countryMetadataMarkup() {
      return "<p class='modalInstructions'>" +
      "<img class='bonusCountryFlag' src=" + countryMetadata.flag + "></img><br>" +
      "Population: " + countryMetadata.population + "<br>" +
      (countryMetadata.capitals.length > 0 ? "Capital City: " + countryMetadata.capitals.join(', ') + "<br>" : "") +
      (countryMetadata.demonym ? "Demonym: " + countryMetadata.demonym + "<br>" : "") +
      (countryMetadata.currencies.length > 0 ? ('Currencies: ' + countryMetadata.currencies + "<br>") : "") +
      (countryMetadata.languages.length > 0 ? ('Languages: ' + countryMetadata.languages + "<br>") : "") +
      (countryMetadata.drivingSide ? 'Drives on the: ' + countryMetadata.drivingSide + "<br>" : "") +
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

    function getClickedTerritoryIndex(gameType, clickedTerritoryCode) {
        return potentialTargets.findIndex(target => {
            return clickedTerritoryCode === (gameType === 'worldCountries' ? target.cca2 : target.abbr);
        });
    }

    $(".well").click(function () {
        if (selectedGameType === 'worldCountries' && !mapRevealed) {
            revealCountry(countryRevealZoom);
        }
    });

});
