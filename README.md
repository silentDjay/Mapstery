Mapstery is inspired by my long history of spending hours on end staring at maps and playing geography games on the internet.

[Play Mapstery here](http://silentdjay.github.io/Mapstery/)

---

The Google Maps JavaScript API is at the heart of the app's functionality, including reverse geocoding from a click on the map. More information on this functionality can be found here:

https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

---

The initial AJAX GET request, to fetch a target country and its relevant data, is made to the [REST Countries](https://restcountries.eu) 'All Countries' endpoint:

https://restcountries.eu/rest/v2/all

---

Notes on Development:

On my local machine, I've used Browserify as server proxy. Once you've installed Browserify, run this command in the directory containing the JS files to update the JS running on the server:

browserify scripts.js -o browserify.js

Then open the index.html file in your browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

[MarkerWithLabel](https://github.com/jesstelford/node-MarkerWithLabel) extends the Google Maps JavaScript API V3 google.maps.Marker class and Mapstery uses it to create custom click markers.
