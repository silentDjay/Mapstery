$(document).ready(function () {
    "use strict";

    // todo: before a call is made, ask the player if they want to play a states version or the countries version of the game!

    var usStateData = [
        {
            "id": 1,
            "country": "USA",
            "name": "Alabama",
            "abbr": "AL",
            "area": "135767SKM",
            "largest_city": "Birmingham",
            "capital": "Montgomery"
        },
        {
            "id": 2,
            "country": "USA",
            "name": "Alaska",
            "abbr": "AK",
            "area": "1723337SKM",
            "largest_city": "Anchorage",
            "capital": "Juneau"
        },
        {
            "id": 3,
            "country": "USA",
            "name": "Arizona",
            "abbr": "AZ",
            "area": "113594SKM",
            "largest_city": "Phoenix",
            "capital": "Phoenix"
        },
        {
            "id": 4,
            "country": "USA",
            "name": "Arkansas",
            "abbr": "AR",
            "area": "52035SKM",
            "largest_city": "Little Rock",
            "capital": "Little Rock"
        },
        {
            "id": 5,
            "country": "USA",
            "name": "California",
            "abbr": "CA",
            "area": "423967SKM",
            "largest_city": "Los Angeles",
            "capital": "Sacramento"
        },
        {
            "id": 6,
            "country": "USA",
            "name": "Colorado",
            "abbr": "CO",
            "area": "103642SKM",
            "largest_city": "Denver",
            "capital": "Denver"
        },
        {
            "id": 7,
            "country": "USA",
            "name": "Connecticut",
            "abbr": "CT",
            "area": "14357SKM",
            "largest_city": "Bridgeport",
            "capital": "Hartford"
        },
        {
            "id": 8,
            "country": "USA",
            "name": "Delaware",
            "abbr": "DE",
            "area": "6446SKM",
            "largest_city": "Wilmington",
            "capital": "Dover"
        },
        {
            "id": 9,
            "country": "USA",
            "name": "Florida",
            "abbr": "FL",
            "area": "170312SKM",
            "largest_city": "Jacksonville",
            "capital": "Tallahassee"
        },
        {
            "id": 10,
            "country": "USA",
            "name": "Georgia",
            "abbr": "GA",
            "area": "57513SKM",
            "largest_city": "Atlanta",
            "capital": "Atlanta"
        },
        {
            "id": 11,
            "country": "USA",
            "name": "Hawaii",
            "abbr": "HI",
            "area": "6423SKM",
            "largest_city": "Honolulu",
            "capital": "Honolulu"
        },
        {
            "id": 12,
            "country": "USA",
            "name": "Idaho",
            "abbr": "ID",
            "area": "82643SKM",
            "largest_city": "Boise",
            "capital": "Boise"
        },
        {
            "id": 13,
            "country": "USA",
            "name": "Illinois",
            "abbr": "IL",
            "area": "149995SKM",
            "largest_city": "Chicago",
            "capital": "Springfield"
        },
        {
            "id": 14,
            "country": "USA",
            "name": "Indiana",
            "abbr": "IN",
            "area": "35826SKM",
            "largest_city": "Indianapolis",
            "capital": "Indianapolis"
        },
        {
            "id": 15,
            "country": "USA",
            "name": "Iowa",
            "abbr": "IA",
            "area": "55857SKM",
            "largest_city": "Des Moines",
            "capital": "Des Moines"
        },
        {
            "id": 16,
            "country": "USA",
            "name": "Kansas",
            "abbr": "KS",
            "area": "213100SKM",
            "largest_city": "Wichita",
            "capital": "Topeka"
        },
        {
            "id": 17,
            "country": "USA",
            "name": "Kentucky",
            "abbr": "KY",
            "area": "104656SKM",
            "largest_city": "Louisville",
            "capital": "Frankfort"
        },
        {
            "id": 18,
            "country": "USA",
            "name": "Louisiana",
            "abbr": "LA",
            "area": "135659SKM",
            "largest_city": "New Orleans",
            "capital": "Baton Rouge"
        },
        {
            "id": 19,
            "country": "USA",
            "name": "Maine",
            "abbr": "ME",
            "area": "91633SKM",
            "largest_city": "Portland",
            "capital": "Augusta"
        },
        {
            "id": 20,
            "country": "USA",
            "name": "Maryland",
            "abbr": "MD",
            "area": "32131SKM",
            "largest_city": "Baltimore",
            "capital": "Annapolis"
        },
        {
            "id": 21,
            "country": "USA",
            "name": "Massachusetts",
            "abbr": "MA",
            "area": "7800SKM",
            "largest_city": "Boston",
            "capital": "Boston"
        },
        {
            "id": 22,
            "country": "USA",
            "name": "Michigan",
            "abbr": "MI",
            "area": "250487SKM",
            "largest_city": "Detroit",
            "capital": "Lansing"
        },
        {
            "id": 36,
            "country": "USA",
            "name": "Oklahoma",
            "abbr": "OK",
            "area": "68595SKM",
            "largest_city": "Oklahoma City",
            "capital": "Oklahoma City"
        },
        {
            "id": 37,
            "country": "USA",
            "name": "Oregon",
            "abbr": "OR",
            "area": "254799SKM",
            "largest_city": "Portland",
            "capital": "Salem"
        },
        {
            "id": 38,
            "country": "USA",
            "name": "Pennsylvania",
            "abbr": "PA",
            "area": "119280SKM",
            "largest_city": "Philadelphia",
            "capital": "Harrisburg"
        },
        {
            "id": 39,
            "country": "USA",
            "name": "Rhode Island",
            "abbr": "RI",
            "area": "1034SKM",
            "largest_city": "Providence",
            "capital": "Providence"
        },
        {
            "id": 40,
            "country": "USA",
            "name": "South Carolina",
            "abbr": "SC",
            "area": "82933SKM",
            "largest_city": "Charleston",
            "capital": "Columbia"
        },
        {
            "id": 41,
            "country": "USA",
            "name": "South Dakota",
            "abbr": "SD",
            "area": "199729SKM",
            "largest_city": "Sioux Falls",
            "capital": "Pierre"
        },
        {
            "id": 42,
            "country": "USA",
            "name": "Tennessee",
            "abbr": "TN",
            "area": "41235SKM",
            "largest_city": "Nashville",
            "capital": "Nashville"
        },
        {
            "id": 43,
            "country": "USA",
            "name": "Texas",
            "abbr": "TX",
            "area": "695662SKM",
            "largest_city": "Houston",
            "capital": "Austin"
        },
        {
            "id": 44,
            "country": "USA",
            "name": "Utah",
            "abbr": "UT",
            "area": "82170SKM",
            "largest_city": "Salt Lake City",
            "capital": "Salt Lake City"
        },
        {
            "id": 23,
            "country": "USA",
            "name": "Minnesota",
            "abbr": "MN",
            "area": "225163SKM",
            "largest_city": "Minneapolis",
            "capital": "St. Paul"
        },
        {
            "id": 24,
            "country": "USA",
            "name": "Mississippi",
            "abbr": "MS",
            "area": "46923SKM",
            "largest_city": "Jackson",
            "capital": "Jackson"
        },
        {
            "id": 25,
            "country": "USA",
            "name": "Missouri",
            "abbr": "MO",
            "area": "180540SKM",
            "largest_city": "Kansas City",
            "capital": "Jefferson City"
        },
        {
            "id": 26,
            "country": "USA",
            "name": "Montana",
            "abbr": "MT",
            "area": "380831SKM",
            "largest_city": "Billings",
            "capital": "Helena"
        },
        {
            "id": 27,
            "country": "USA",
            "name": "Nebraska",
            "abbr": "NE",
            "area": "200330SKM",
            "largest_city": "Omaha",
            "capital": "Lincoln"
        },
        {
            "id": 28,
            "country": "USA",
            "name": "Nevada",
            "abbr": "NV",
            "area": "286380SKM",
            "largest_city": "Las Vegas",
            "capital": "Carson City"
        },
        {
            "id": 29,
            "country": "USA",
            "name": "New Hampshire",
            "abbr": "NH",
            "area": "24214SKM",
            "largest_city": "Manchester",
            "capital": "Concord"
        },
        {
            "id": 30,
            "country": "USA",
            "name": "New Jersey",
            "abbr": "NJ",
            "area": "22591SKM",
            "largest_city": "Newark",
            "capital": "Trenton"
        },
        {
            "id": 31,
            "country": "USA",
            "name": "New Mexico",
            "abbr": "NM",
            "area": "314917SKM",
            "largest_city": "Albuquerque",
            "capital": "Santa Fe"
        },
        {
            "id": 32,
            "country": "USA",
            "name": "New York",
            "abbr": "NY",
            "area": "141297SKM",
            "largest_city": "New York City",
            "capital": "Albany"
        },
        {
            "id": 33,
            "country": "USA",
            "name": "North Carolina",
            "abbr": "NC",
            "area": "139391SKM",
            "largest_city": "Charlotte",
            "capital": "Raleigh"
        },
        {
            "id": 34,
            "country": "USA",
            "name": "North Dakota",
            "abbr": "ND",
            "area": "183108SKM",
            "largest_city": "Fargo",
            "capital": "Bismarck"
        },
        {
            "id": 35,
            "country": "USA",
            "name": "Ohio",
            "abbr": "OH",
            "area": "40861SKM",
            "largest_city": "Columbus",
            "capital": "Columbus"
        },
        {
            "id": 45,
            "country": "USA",
            "name": "Vermont",
            "abbr": "VT",
            "area": "24906SKM",
            "largest_city": "Burlington",
            "capital": "Montpelier"
        },
        {
            "id": 46,
            "country": "USA",
            "name": "Virginia",
            "abbr": "VA",
            "area": "110787SKM",
            "largest_city": "Virginia Beach",
            "capital": "Richmond"
        },
        {
            "id": 47,
            "country": "USA",
            "name": "Washington",
            "abbr": "WA",
            "area": "184661SKM",
            "largest_city": "Seattle",
            "capital": "Olympia"
        },
        {
            "id": 48,
            "country": "USA",
            "name": "West Virginia",
            "abbr": "WV",
            "area": "24038SKM",
            "largest_city": "Charleston",
            "capital": "Charleston"
        },
        {
            "id": 49,
            "country": "USA",
            "name": "Wisconsin",
            "abbr": "WI",
            "area": "169635SKM",
            "largest_city": "Milwaukee",
            "capital": "Madison"
        },
        {
            "id": 50,
            "country": "USA",
            "name": "Wyoming",
            "abbr": "WY",
            "area": "97093SKM",
            "largest_city": "Cheyenne",
            "capital": "Cheyenne"
        }
    ];

    var potentialTargets; // formerly countriesData
    var selectedGameType;

    var targetState;
    var stateClickedFullName;
    var bonusStateData = {
        capital: '',
        largest_city: ''
    };

    var targetCountryData;
    var countryToClickName;
    var countryToClickCode;
    var countryToClickFlag;
    var countryToClickArea;
    var goalLatLng = {lat: "", lng: ""};
    var regionHint;
    var numBorderCountries;
    var borderCountryCodes = [];
    var borderCountryNames = [];
    var borderCountryList;
    var clickedTerritoryCode;
    var countryClicked;
    var bonusCountryData =
        {
            flag: "",
            population: "",
            demonym: "",
            capital: ""
        };
    var mapRevealed = false;
    var previousMilesFromTarget;
    var clickDistanceHint;
    var countryRevealZoom;

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
            zoomControl: true,
            draggableCursor: 'crosshair'
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

            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    if (selectedGameType === 'worldCountries') {
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
                    $(".modal").html("Whoops! You clicked on unclaimed territory! " +
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
                data: {fields: "flag;name;alpha2Code;alpha3Code;capital;subregion;population;latlng;demonym;area;borders"},
                success: function (allCountryData) {
                    potentialTargets = allCountryData;
                    setUpCountry(potentialTargets);
                }, error: function (request, error) {
                    console.error(error);
                }
            });
            console.info(potentialTargets);
            // setUpCountry(potentialTargets);
        } else if (gameType === 'usStates') {
            // this endpoint has the data I need, but it throws CORS errors ...
            // dataEndpoint = 'http://services.groupkt.com/state/get/USA/all';

            potentialTargets = usStateData;
            map.setZoom(4);
            map.setCenter({
                lat: 39.810556,
                lng: -98.556111
            });
            setUpState(potentialTargets);
        } else {
            alert("uh oh! Mapstery can't do that yet");
        }
    }

    function setUpState(statesDataArray) {
        var randCountryNum = Math.floor(Math.random() * statesDataArray.length);
        targetState = statesDataArray[randCountryNum];
        getBonusStateData(randCountryNum);

        $(".modal").modal('show');
        $(".modal").html("Click on " + targetState.name +
            "<div id='proceed_button' class='modalInstructions'>" +
            "<button type='button' class='btn btn-primary' data-dismiss='modal'>Click to start playing</button></div>"
        );
        $("#proceed_button").modal('show');
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
        getBonusCountryData(randCountryNum);

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
                getBonusCountryData(clickedCountryIndex);
                $(".modal").append("<p class='modalInstructions'>" +
                    "Flag: <img class='bonusCountryFlag' src=" + bonusCountryData.flag + "></img>" +
                    "<br>Population: " + bonusCountryData.population +
                    "<br>Demonym: " + bonusCountryData.demonym +
                    "<br>Capital City: " + bonusCountryData.capital +
                    "<br><button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the map</button>" +
                    "</p>"
                );
            } else if (selectedGameType === 'usStates') {
                var clickedStateIndex = potentialTargets.findIndex(getClickedStateIndex);
                if (clickedStateIndex != -1) {
                    getBonusStateData(clickedStateIndex);
                    $(".modal").append("<p class='modalInstructions'>" +
                        "Capital City: " + bonusStateData.capital +
                        "<br>Largest City: " + bonusStateData.largest_city +
                        "<br><button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the map</button>" +
                        "</p>"
                    );
                } else {
                    $(".modal").append("<p class='modalInstructions'>" +
                        "<button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the map</button>" +
                        "</p>"
                    );
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

    function victoryDisplay(targetCountryName) {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        $(".modal").modal('show');
        var msg = "";
        if (markers.length === 1) {
            msg = "Fantastic! You found " + targetCountryName + " on the first try!"
        } else {
            msg = "You found " + targetCountryName + " after " + markers.length + " tries!"
        }

        mapRevealed = true;

        if (selectedGameType === 'worldCountries') {
            $(".modal").html(msg + "<div class='modalInstructions'>" +
                "Flag: <img class='bonusCountryFlag' src=" + bonusCountryData.flag + "></img>" +
                "<br>Population: " + bonusCountryData.population +
                "<br>Demonym: " + bonusCountryData.demonym +
                "<br>Capital City: " + bonusCountryData.capital + "</div>" +
                "<div id='proceed_button' class='modalInstructions'>" +
                "<button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the map</button>" +
                "</div>"
            );
            $(".well").html("<a href='javascript:window.location.reload()'>Play Mapstery Again</a>");
        } else if (selectedGameType === 'usStates') {
            $(".modal").html(msg + "<div class='modalInstructions'>" +
                "Capital City: " + bonusStateData.capital +
                "<br>Largest City: " + bonusStateData.largest_city + "</div>" +
                "<div id='proceed_button' class='modalInstructions'>" +
                "<button type='button' class='btn btn-primary' data-dismiss='modal'>Explore the map</button>" +
                "</div>"
            );
            $(".well").html("<a href='javascript:window.location.reload()'>Play Mapstery Again</a>");
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
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        map.setCenter(goalLatLng);
        map.setZoom(zoomLevel);
        mapRevealed = true;
        $(".well").html("<a href='javascript:window.location.reload()'>Play Mapstery Again!</a>");
    }

    function getBonusCountryData(countryIndex) {
        bonusCountryData.flag = potentialTargets[countryIndex].flag;
        var popNum = potentialTargets[countryIndex].population;
        bonusCountryData.population = makeNumbersPretty(popNum);
        bonusCountryData.demonym = potentialTargets[countryIndex].demonym;
        bonusCountryData.capital = potentialTargets[countryIndex].capital;
    }

    function getBonusStateData(stateIndex) {
        bonusStateData.largest_city = potentialTargets[stateIndex].largest_city;
        bonusStateData.capital = potentialTargets[stateIndex].capital;
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
