# Mapstery

Mapstery is inspired by my long history of spending hours on end staring at maps and playing geography games on the internet.

[Play Mapstery here].

## Built with

### Map Data
The [Google Maps JavaScript API] is at the heart of the app's functionality, enabling [reverse geocoding] from a click on the map.

### Country Data
The initial AJAX GET request to fetch all relevant country data is made to the [REST Countries] 'All Countries' endpoint:

```html
https://restcountries.eu/rest/v2/all
```

### Custom click markers
[MarkerWithLabel] extends the Google Maps JavaScript API V3 `google.maps.Marker` class and Mapstery uses it to create custom click markers.

## Development

### Server Proxy
[Browserify]/[Watchify] serves as the development server proxy for Mapstery. Once installed, run these in `assets/js` to update the JS running on the server:

```bash
browserify scripts.js -o browserify.js

//or 

watchify scripts.js -o browserify.js -v
```

Then, open `index.html` in your browser and you're good to go!

License
=======
[Mozilla Public License] MPL 2.0

[Browserify]: https://github.com/substack/browserify-handbook
[Google Maps JavaScript API]: https://developers.google.com/maps/documentation/javascript/
[MarkerWithLabel]: https://github.com/jesstelford/node-MarkerWithLabel
[Mozilla Public License]: https://www.mozilla.org/en-US/MPL/2.0/
[Play Mapstery here]: http://silentdjay.github.io/Mapstery/
[REST Countries]: https://restcountries.eu
[reverse geocoding]: https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
[Watchify]: https://github.com/browserify/watchify
