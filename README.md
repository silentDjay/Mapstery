Mapstery is inspired by my long history of spending hours on end staring at maps and playing geography games on the internet.

[Play Mapstery here](http://silentdjay.github.io/Mapstery/)

---

The Google Maps JavaScript API is at the heart of the app's functionality, including reverse geocoding from a click on the map. More information on this functionality can be found here:

https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

---

The initial AJAX call, to fetch a target country and its relevant data, is made to the REST Countries 'All Countries' API:

https://restcountries.eu/

---

Notes on Development:

On my local machine, I've used Browserify as server proxy. Once you've installed Browserify, run this command in the directory containing the JS files to update the JS running on the server:

browserify scripts.js -o browserify.js

Then open the index.html file in your browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

---

Improvements still to implement:

* Remove 'So Close!' text from border country hints, and integrate 'landlocked' info from restcountries into border country hints (and bordering bodies of water if available!)
* Keep a record of previous countries clicked/not clicked and how many clicks it took to find (Node backend)
* Use Leaflet/D3 to create interactive maps to display collective gameplay data

---

Bugs to fix:

* Fix inconsistent click distance calculations (difficult to reproduce; I should possibly use different values for click lat/lng or target country lat/lng)
* Clicks on these territories do not return country/any results from the Google Maps API:

    * Arunachal Pradesh (far northeastern India)
    * Crimea
    * Kosovo
    * Palestine
    * Jammu and Kashmir (far northern India) - there are a LOT of separate disputed territories up there
    * South Ossetia (Georgia)
    * Abkhazia (Georgia)
    * North Cyprus
    * Southern Kuril Islands (North of Sapporo)

Additional examples can be found on this list: https://en.wikipedia.org/wiki/List_of_territorial_disputes

To address this, choose which country you want them to belong to (or report them as 'Unclaimed Territory' and include it in the list of potential countries(you'll need to differentiate this from clicks on bodies of water)) OR approximate their locations with lat/lng and in the case that no data is returned within that approximate area, provide data accordingly.

* Vatican City/Holy See returns poorly formed country data upon click (country name and zip code)
* US Minor Outlying Islands doesn't have lat/lng data for the reveal
* Clicks on Guernsey, Gambier Islands, and others(?) generate "Cannot read property 'formatted_address' of undefined" errors
