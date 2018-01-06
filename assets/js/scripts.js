$(document).ready(function () {
    "use strict";

    // todo: before a call is made, ask the player if they want to play a states version or the countries version of the game!

    var usStateData = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];
    var targetState;
    var stateClickedNickname;
    var stateClickedFullName;

    var countriesData;
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
    var clickedCountryCode;
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
     http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */

    // begin state setup and game initiation
    function setUpState(statesDataArray) {
        var randCountryNum = Math.floor(Math.random() * (52 - 0 + 1)) + 0;
        targetState = statesDataArray[randCountryNum];

        $(".modal").modal('show');
        $(".modal").html("Click on " + targetState.name +
            "<div class='modalInstructions' data-dismiss='modal'>(Click anywhere to start)</div>");
        $(".well").html("Click on " + targetState.name +
            "<div id='reveal-country'>Or click here to reveal " + targetState.name + "</div>");
    }

    setUpState(usStateData);

    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 42.29, lng: -85.585833},
            zoom: 4,
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
                var markerLabel = markersLength + "<br>" + stateClickedNickname;

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

            var geocoder = new google.maps.Geocoder;
            var latlng = {lat: clickedLatitude, lng: clickedLongitude};

            function isStateName(element) {
                return element.types[0] === "administrative_area_level_1";
            }

            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    var stateIndex = results.findIndex(isStateName);

                    stateClickedNickname = results[stateIndex].address_components[0].short_name;
                    stateClickedFullName = results[stateIndex].address_components[0].long_name;
                    console.info(stateClickedNickname + ' ' + stateClickedFullName);

                    if (mapRevealed === false) {
                        if (targetState.abbreviation === stateClickedNickname) {
                            placeMarker(event.latLng, 'green');
                            victoryDisplay(stateClickedFullName);
                        } else {
                            $(".modal").modal('show');
                            $(".modal").html("You clicked on " + stateClickedFullName);
                            placeMarker(event.latLng, 'red');
                        }
                    } else {
                        $(".modal").modal('show');
                        $(".modal").html("You clicked on " + stateClickedFullName);
                    }
                } else {
                    $(".modal").modal('show');
                    $(".modal").html("Whoops! You clicked on unclaimed territory! " +
                        "<br> <p class='modalInstructions' data-dismiss='modal'>Try again!</p>");
                }

            });
        });
    }
    // end state setup and gameplay

    $.ajax({
        method: 'GET',
        url: 'https://restcountries.eu/rest/v2/all',
        data: { fields: "flag;name;alpha2Code;alpha3Code;capital;subregion;population;latlng;demonym;area;borders"},
        success: function (allCountryData) {
            countriesData = allCountryData;
            // setUpCountry(countriesData);
        }, error: function (request, error) {
            console.error(error);
        }
    });

    function setUpCountry(countriesDataArray) {
        var randCountryNum = Math.floor(Math.random() * (246 - 0 + 1)) + 0;
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
            "<div class='modalInstructions' data-dismiss='modal'>(Click anywhere to start)</div>");
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

    // function resetMarkers() {
    //   for (var i=0;i<markers.length;i++) {
    //     markers[i].setMap(null);
    //   }
    //   markers = [];
    // }

    // window.initMap = function () {
    //     map = new google.maps.Map(document.getElementById('map'), {
    //         center: {lat: 42.29, lng: -85.585833},
    //         zoom: 3,
    //         mapTypeId: google.maps.MapTypeId.SATELLITE,
    //         disableDefaultUI: true,
    //         zoomControl: true,
    //         draggableCursor: 'crosshair'
    //     });
    //
    //     //get the latitude and longitude of a user's click
    //     google.maps.event.addListener(map, "click", function (event) {
    //
    //         var MarkerWithLabel = require('markerwithlabel')(google.maps);
    //
    //         function placeMarker(location, color) {
    //             markersLength = (markers.length + 1).toString();
    //             var markerLabel = markersLength + "<br>" + clickedCountryCode;
    //
    //             var clickMarker = new MarkerWithLabel({
    //                 position: location,
    //                 map: map,
    //                 labelContent: markerLabel,
    //                 labelAnchor: new google.maps.Point(10, 50),
    //                 labelClass: "labels", // the CSS class for the label
    //                 labelInBackground: false,
    //                 icon: pinSymbol(color)
    //             });
    //
    //             markers.push(clickMarker);
    //         }
    //
    //         function pinSymbol(color) {
    //             return {
    //                 path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
    //                 fillColor: color,
    //                 fillOpacity: 1,
    //                 strokeColor: '#000',
    //                 strokeWeight: 2,
    //                 scale: 1.5
    //             };
    //         }
    //
    //         var clickedSpot = {position: event.latLng, map: map};
    //         var clickedLatitude = clickedSpot.position.lat();
    //         var clickedLongitude = clickedSpot.position.lng();
    //         var distFromTargetCountry = calcLatLangDistance(goalLatLng.lat,
    //             goalLatLng.lng,
    //             clickedLatitude,
    //             clickedLongitude);
    //
    //         var geocoder = new google.maps.Geocoder;
    //         var latlng = {lat: clickedLatitude, lng: clickedLongitude};
    //
    //         function isCountryName(element) {
    //             return element.types[0] === "country";
    //         }
    //
    //         geocoder.geocode({'location': latlng}, function (results, status) {
    //             if (status === google.maps.GeocoderStatus.OK) {
    //
    //                 var countryIndex = results.findIndex(isCountryName);
    //
    //                 if (countryIndex === -1) {
    //                     resultsLoop:
    //                         for (var resultsIndex = (results.length - 1); resultsIndex >= 0; resultsIndex--) {
    //                             for (var addressIndex = (results[resultsIndex].address_components.length - 1);
    //                                  addressIndex >= 0; addressIndex--) {
    //                                 if (isCountryName(results[resultsIndex].address_components[addressIndex])) {
    //                                     countryClicked = results[resultsIndex].address_components[addressIndex].long_name;
    //                                     clickedCountryCode = results[resultsIndex].address_components[addressIndex].short_name;
    //                                     break resultsLoop;
    //                                 }
    //                             }
    //                         }
    //                 } else {
    //                     countryClicked = results[countryIndex].address_components[0].long_name;
    //                     clickedCountryCode = results[countryIndex].address_components[0].short_name;
    //                 }
    //
    //                 if (mapRevealed === false) {
    //                     if (clickedCountryCode === countryToClickCode) {
    //                         placeMarker(event.latLng, 'green');
    //                         victoryDisplay(countryToClickName);
    //                     } else {
    //                         $(".modal").modal('show');
    //                         $(".modal").html("You clicked on " + countryClicked);
    //                         placeMarker(event.latLng, 'red');
    //
    //                         //determine the supplementary message to display upon click
    //                         if (numBorderCountries === 0) {
    //                             constructHint(mapRevealed, distFromTargetCountry,
    //                                 markers.length, numBorderCountries);
    //                         } else {
    //                             var clickedBorderIndex = borderCountryCodes.indexOf(clickedCountryCode);
    //
    //                             if (clickedBorderIndex === -1) {
    //                                 constructHint(mapRevealed, distFromTargetCountry,
    //                                     markers.length, numBorderCountries);
    //                             } else {
    //                                 constructHint(mapRevealed, distFromTargetCountry,
    //                                     markers.length, numBorderCountries,
    //                                     clickedBorderIndex);
    //                             }
    //                         }
    //                     }
    //                 } else {
    //                     $(".modal").modal('show');
    //                     $(".modal").html("You clicked on " + countryClicked);
    //                     constructHint(mapRevealed);
    //                 }
    //             } else {
    //                 $(".modal").modal('show');
    //                 $(".modal").html("Whoops! You clicked on unclaimed territory! " +
    //                     "<br> <p class='modalInstructions' data-dismiss='modal'>Try again!</p>");
    //             }
    //
    //         });
    //     });
    // }

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
            if (previousMilesFromTarget > mi) {
                isCloser = true;
            } else {
                isCloser = false;
            }
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

            $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                clickDistanceHint + " Your click was about " + distFromTarget.miles +
                " Miles (" + distFromTarget.kilometers + " Kilometers) from " +
                countryToClickName);
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
                    $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                        countryClicked + " is the only country that shares a border with " +
                        countryToClickName + "!");
                } else if (modifiedBorderCountryNames.length === 1) {
                    $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                        countryToClickName + " shares a border with " + countryClicked + " and " +
                        borderCountryList);
                } else {
                    $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                        countryToClickName + " shares a border with " + countryClicked +
                        ", as well as " + borderCountryList);
                }
            } else if (numClicks > 5) {

                if (borderCount === 0) {
                    $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                        "Hint: " + countryToClickName + " is an island nation in " +
                        regionHint + "</p>");
                } else {
                    constructBorderCountryList(borderCountryNames);
                    $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                        "Hint: " + countryToClickName + " is in " + regionHint +
                        " and shares a border with " + borderCountryList);
                }
            } else {
                $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" + "Try again!</p>");
            }
        } else {
            var clickedCountryIndex = countriesData.findIndex(getClickedCountryIndex);
            getBonusCountryData(clickedCountryIndex);
            $(".modal").append("<p class='modalInstructions' data-dismiss='modal'>" +
                "Flag: <img class='bonusCountryFlag' src=" + bonusCountryData.flag + "></img>" +
                "<br>Population: " + bonusCountryData.population +
                "<br>Demonym: " + bonusCountryData.demonym +
                "<br>Capital City: " + bonusCountryData.capital + "</p>");
        }
    };

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
    };

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
        $(".modal").html(msg + "<div class='modalInstructions' data-dismiss='modal'>");
            // "Flag: <img class='bonusCountryFlag' src=" + bonusCountryData.flag + "></img>" +
            // "<br>Population: " + bonusCountryData.population +
            // "<br>Demonym: " + bonusCountryData.demonym +
            // "<br>Capital City: " + bonusCountryData.capital +
            // "<br>Click anywhere to explore the map!</div>");
        $(".well").html("<a href='javascript:window.location.reload()'>Find a new state!</a>");
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
        $(".well").html("<a href='javascript:window.location.reload()'>Find a new country!</a>");
    }

    function getBonusCountryData(countryIndex) {
        bonusCountryData.flag = countriesData[countryIndex].flag;
        var popNum = countriesData[countryIndex].population;
        bonusCountryData.population = makeNumbersPretty(popNum);
        bonusCountryData.demonym = countriesData[countryIndex].demonym;
        bonusCountryData.capital = countriesData[countryIndex].capital;
    };

    function getClickedCountryIndex(allCountries) {
        return allCountries.alpha2Code === clickedCountryCode;
    };

    $(".well").click(function () {
        revealCountry(countryRevealZoom);
    });

    // function startNewRound() {
    //   map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    //   resetMarkers();
    //   setUpCountry(countryList);
    // }

});
