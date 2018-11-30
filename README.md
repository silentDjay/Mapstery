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
[webpack] serves as the development server proxy for Mapstery. To start the server, use:

```bash
npm run dev
```

Then, open `localhost:8080` in your browser and you're good to go!

When you've made your desired changes to `src/js/scripts.js` and are ready to commit, 
you can build the project with webpack with

```bash
npm run build
```

License
=======
[Mozilla Public License] MPL 2.0

[webpack]: https://webpack.js.org/
[Google Maps JavaScript API]: https://developers.google.com/maps/documentation/javascript/
[MarkerWithLabel]: https://github.com/jesstelford/node-MarkerWithLabel
[Mozilla Public License]: https://www.mozilla.org/en-US/MPL/2.0/
[Play Mapstery here]: http://silentdjay.github.io/Mapstery/
[REST Countries]: https://restcountries.eu
[reverse geocoding]: https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding