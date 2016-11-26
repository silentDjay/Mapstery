Mapstery is inspired by my long history of spending hours on end staring at maps and playing geography games on the internet.

---

The Google Maps JavaScript API is at the heart of the app's functionality, including reverse geocoding from a click on the map. More information on this functionality can be found here:

https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

---

The initial AJAX call, to fetch a target country and its relevant data, is made to the REST Countries 'All Countries' API:

https://restcountries.eu/

---

Notes on Development:

On my local machine, I've used Browserify as server proxy. To update the JS running on the server, run this command in the directory containing the JS files:

browserify scripts.js -o browserify.js

Then open the index.html file in the browser and you're good to go!

more information on Browserify: https://github.com/substack/browserify-handbook

---

Improvements still to implement:

* Keep a record of previous countries clicked/not clicked and how many clicks it took to find (Node backend)
* Tell the user how far away they click from the target country (convert lat/lng averages between click and target country to relevant distance (inches on screen???))

---

Bugs to fix:

* Clicks on the Republic of Kosovo or Palestine do not return country/any results from the Google Maps API (approximate their locations with lat/lng and in the case that no data is returned within that approximate area, provide data accordingly.)
* Vatican City/Holy See returns poorly formed country address upon successful click (I think the real problem is that the country name returned upon successful click is from Google Maps, not from the original list)
* US Minor Outlying Islands doesn't have lat/lng data for the reveal
* Disable clicks after country is found or revealed
* Clicks on the modalInstructions class do not close the modal
