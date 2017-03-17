Mapstery is inspired by my long history of spending hours on end staring at maps and playing geography games on the internet.

[Play Mapstery here](http://silentdjay.github.io/Mapstery/)

---

The Google Maps JavaScript API is at the heart of the app's functionality, including reverse geocoding from a click on the map. More information on this functionality can be found here:

https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

---

The initial AJAX call, to fetch a target country and its relevant data, is made to the REST Countries 'All Countries' API (v1):

https://restcountries.eu/v1

---

Notes on Development:

On my local machine, I've used Browserify as server proxy. Once you've installed Browserify, run this command in the directory containing the JS files to update the JS running on the server:

browserify scripts.js -o browserify.js

Then open the index.html file in your browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

---

Improvements to implement:

* Update initial data call to use v2 of RESTcountries API
* Show special country data when revealed without a click (give up)
* Keep a record of previous countries clicked/not clicked and how many clicks it took to find (Node backend)
* Use Leaflet/D3 to create interactive maps to display collective gameplay data
