import { countryData } from "../data/countryData";
import { GameStatus, Coordinates, Country } from "../types";

export const getRandomCountryData = () => {
  var randCountryNum = Math.floor(Math.random() * countryData.length);
  return countryData[randCountryNum];
};

export const getCountryDataFromCca2Code = (code: string) =>
  countryData.find((country) => country.cca2 === code);

export const getCountryDataFromCca3Code = (code: string) =>
  countryData.find((country) => country.cca3 === code);

export const getMapZoomLevel = (
  countryArea: number,
  countryLatitude: number
) => {
  let zoomLevel = 0;

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

  // countries in the northern hemisphere above the artic circle appear relatively large
  zoomLevel -= countryLatitude > 70 ? 2 : 0;

  return zoomLevel;
};

export const initialMapProps: google.maps.MapOptions = {
  center: { lat: 42.29, lng: -85.585833 },
  zoom: 3,
  mapTypeId: "satellite",
  fullscreenControl: false,
  disableDefaultUI: true,
  zoomControl: window.innerWidth > 500 ? true : false,
  draggableCursor: "crosshair",
  scaleControl: true,
  minZoom: 2,
};

export const getMapOptions = (
  gameStatus: GameStatus,
  targetCountryData?: Country
): google.maps.MapOptions => {
  return gameStatus === "PENDING"
    ? initialMapProps
    : gameStatus === "INIT"
    ? {
        ...initialMapProps,
        zoom: 2,
        center: {
          lat: 0,
          lng: 0,
        },
      }
    : // TODO: for SUCCESS or FORFEIT, enable the satellite/roadmap controls again (or make a custom one)
    gameStatus === "SUCCESS"
    ? { mapTypeId: "roadmap" }
    : gameStatus === "FORFEIT" && !!targetCountryData
    ? {
        mapTypeId: "roadmap",
        center: {
          lat: targetCountryData.latlng[0],
          lng: targetCountryData.latlng[1],
        },
        zoom: getMapZoomLevel(
          targetCountryData.area,
          targetCountryData.latlng[0]
        ),
      }
    : {};
};

export const generateMarkerContent = (
  countryCode: string,
  index: number,
  winner: boolean
) => {
  const element = document.createElement("div");
  element.className = `click-marker ${winner ? "click-marker-success" : ""}`;
  element.innerHTML = `<b>${index + 1}</b> | <b>${countryCode}</b>`;

  return element;
};

export const convertKmtoMi = (km: number) => {
  return Math.round(km * 0.621371);
};

export const getBorderCountryList = (codes: string[]) => {
  return codes
    .map((countryCode, i) => {
      const name = getCountryDataFromCca3Code(countryCode)?.name.common;
      if (codes.length > 1) {
        return i === codes.length - 1
          ? `and ${name}`
          : `${name}${codes.length === 2 ? " " : ", "}`;
      }
      return name;
    })
    .join("");
};

/* credit to this poster:
    http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    */
export const getClickDistanceFromTarget = (
  targetLatLng: Coordinates,
  clickLatLng: google.maps.LatLng
) => {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((targetLatLng[0] - clickLatLng.lat()) * p) / 2 +
    (c(clickLatLng.lat() * p) *
      c(targetLatLng[0] * p) *
      (1 - c((targetLatLng[1] - clickLatLng.lng()) * p))) /
      2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

export const getCountryHemispheres = (latlng: Coordinates) => {
  return `${latlng[0] > 0 ? "Northern" : "Southern"} and ${
    latlng[1] > 0 ? "Eastern" : "Western"
  }`;
};
