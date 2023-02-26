# Mapstery

Mapstery is inspired by my long history of spending hours on end staring at maps and playing geography games on the internet.

[Play Mapstery here].

## Built with

- [React]
- [Google Maps JavaScript API]
- [@googlemaps/react-wrapper]
- [GeoNames `CountryCode` API] provides the [reverse geocoding] logic

## Development

### Prerequisites

To run Mapstery locally, you'll need to provide two things:

1. The username of a [GeoNames account] that has been activated to use their 'web services'
2. A [Google Maps API Key]

Add those two values into a new file called `.env.local` at the root directory as follows:

```dotenv
REACT_APP_GOOGLE_API_KEY=[your_api_key]
REACT_APP_GEONAMES_USERNAME=[your_username]
```

### Run Mapstery

Install all dependencies with

```bash
npm install
```

Start a Mapstery dev server using the configuration in `.env.local` with

```bash
npm start:local
```

Mapstery will run at `localhost:3000`. You're good to go!

# License

[Mozilla Public License] MPL 2.0

[geonames account]: https://www.geonames.org/login
[geonames `countrycode` api]: https://www.geonames.org/export/web-services.html#countrycode
[google maps api key]: https://developers.google.com/maps/documentation/javascript/get-api-key#create-api-keys
[google maps javascript api]: https://developers.google.com/maps/documentation/javascript/
[@googlemaps/react-wrapper]: https://www.npmjs.com/package/@googlemaps/react-wrapper
[mozilla public license]: https://www.mozilla.org/en-US/MPL/2.0/
[play mapstery here]: https://mapstery.world
[react]: https://reactjs.org/
[reverse geocoding]: https://en.wikipedia.org/wiki/Reverse_geocoding
