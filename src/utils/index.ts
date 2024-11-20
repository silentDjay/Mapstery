import posthog from "posthog-js";

import { countryData } from "../data/countryData";
import {
  Click,
  ClickStatus,
  Coordinates,
  Country,
  GameStatus,
  GameCategory,
  AnalyticsEventData,
  AnalyticsEventType,
} from "../types";

const hugeCountryThreshold = 1500000;
const largeCountryThreshold = 250000;
const smallCountryThreshold = 25000;
const tinyCountryThreshold = 1000;

export const getRelativeCountrySize = (area: number) => {
  return area > hugeCountryThreshold
    ? "Huge"
    : area > largeCountryThreshold
      ? "Large"
      : area > smallCountryThreshold
        ? "Medium"
        : area > tinyCountryThreshold
          ? "Small"
          : "Tiny";
};

const campaignLocalStorageKey = "mapsteryCampaign";
export const campaignLength = countryData.length;

export const isCampaignCompleted = () => {
  return getCountriesFoundList("MAPSTERY_QUEST").length === campaignLength;
};

export const addCountryToLocalStorageList = (
  countryCode: string,
  category: GameCategory
) => {
  const localStorageKey =
    category === "MAPSTERY_QUEST" ? campaignLocalStorageKey : category;
  const countriesList = localStorage.getItem(localStorageKey);
  if (!countriesList) {
    localStorage.setItem(localStorageKey, JSON.stringify([countryCode]));
  } else {
    const parsedCountriesList = JSON.parse(countriesList);
    if (!parsedCountriesList.includes(countryCode)) {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify([...parsedCountriesList, countryCode])
      );
    }
  }
};

export const getCountriesFoundList = (category: GameCategory): string[] => {
  const localStorageKey =
    category === "MAPSTERY_QUEST" ? campaignLocalStorageKey : category;

  return !!localStorage.getItem(localStorageKey)
    ? JSON.parse(localStorage.getItem(localStorageKey) as string)
    : [];
};

export const removeCountriesFoundList = (category: GameCategory) => {
  const localStorageKey =
    category === "MAPSTERY_QUEST" ? campaignLocalStorageKey : category;

  localStorage.removeItem(localStorageKey);
};

export const getFilteredCountryList = (
  category: GameCategory,
  previousTargetCountry?: string,
  ignoreRepeatedCountries: boolean = false
) =>
  countryData.filter((country) => {
    if (!ignoreRepeatedCountries) {
      const countriesFoundInCurrentGame = getCountriesFoundList(category);

      const isPreviousTarget = country.cca2 === previousTargetCountry;
      const countryAlreadyFound = countriesFoundInCurrentGame.includes(
        country.cca2
      );

      if (
        countriesFoundInCurrentGame.length === 1
          ? countryAlreadyFound
          : isPreviousTarget || countryAlreadyFound
      )
        return false;
    }

    switch (category) {
      case "AFRICA":
        return country.subregion.includes("Africa");
      case "ANTARCTIC":
        return country.subregion === "The Antarctic";
      case "ASIA":
        return country.subregion.includes("Asia");
      case "EUROPE":
        return country.subregion.includes("Europe");
      case "NORTH_AMERICA":
        return ["North America", "Central America"].includes(country.subregion);
      case "CARIBBEAN":
        return country.subregion === "The Caribbean";
      case "SOUTH_AMERICA":
        return country.subregion === "South America";
      case "OCEANIA":
        return [
          "Polynesia",
          "Melanesia",
          "Micronesia",
          "Australia and New Zealand",
        ].includes(country.subregion);
      case "ISLAND_COUNTRIES":
        return country.borders.length === 0;
      case "LANDLOCKED_COUNTRIES":
        return country.landlocked;
      case "LARGE_COUNTRIES":
        return country.area > largeCountryThreshold;
      case "SMALL_COUNTRIES":
        return country.area < smallCountryThreshold;
      case "POPULOUS_COUNTRIES":
        return country.population > 100000000;
      case "NON_POPULOUS_COUNTRIES":
        return country.population < 50000;
      case "MAPSTERY_QUEST":
        return !getCountriesFoundList("MAPSTERY_QUEST").includes(country.cca2);
      default: // "PLANET_EARTH"
        return true;
    }
  });

export const getRandomCountryData = (
  category: GameCategory,
  previousTargetCountry?: string
) => {
  const filteredCountryList = getFilteredCountryList(
    category,
    previousTargetCountry
  );

  // console.info(
  //   filteredCountryList.length,
  //   " countries of ",
  //   countryData.length,
  //   " in category ",
  //   category
  // );

  const randCountryNum = Math.floor(Math.random() * filteredCountryList.length);
  return filteredCountryList[randCountryNum];
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

  // countries in the northern hemisphere above the arctic circle appear relatively large
  zoomLevel -= countryLatitude > 70 ? 2 : 0;

  return zoomLevel;
};

export const initialMapProps: google.maps.MapOptions = {
  center: { lat: 42.29, lng: -85.585833 },
  zoom: 3,
  mapTypeId: "satellite",
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: window.innerWidth > 500 ? true : false,
  draggableCursor: "crosshair",
  scaleControl: true,
  minZoom: 2,
};

export const getInitialMapPropsByGameCategory = (
  category: GameCategory | undefined
) => {
  switch (category) {
    case "AFRICA":
      return {
        center: {
          lat: 2.37,
          lng: 16.06,
        },
      };
    case "ANTARCTIC":
      return {
        zoom: 2,
        center: {
          lat: -30,
          lng: -40,
        },
      };
    case "ASIA":
      return {
        zoom: 2,
        center: {
          lat: 40,
          lng: 95,
        },
      };
    case "EUROPE":
      return {
        center: {
          lat: 58.416667,
          lng: 22.5,
        },
      };
    case "NORTH_AMERICA":
      return {
        zoom: 2,
        center: {
          lat: 48.37,
          lng: -110,
        },
      };
    case "CARIBBEAN":
      return {
        zoom: 4,
        center: {
          lat: 18,
          lng: -72,
        },
      };
    case "SOUTH_AMERICA":
      return {
        center: {
          lat: -17.154835,
          lng: -58.850156,
        },
      };
    case "OCEANIA":
      return {
        center: {
          lat: -5.848531,
          lng: 162.860786,
        },
      };
    default:
      return {
        zoom: 2,
        center: {
          lat: 0,
          lng: 0,
        },
      };
  }
};

export const getMapOptions = (
  gameStatus: GameStatus,
  gameCategory?: GameCategory,
  targetCountryData?: Country
): google.maps.MapOptions => {
  const revealedMapOptions: google.maps.MapOptions = {
    mapTypeId: "terrain",
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
  };

  switch (gameStatus) {
    case "PENDING":
      return initialMapProps;
    case "INIT":
      return {
        ...initialMapProps,
        ...getInitialMapPropsByGameCategory(gameCategory),
      };
    case "SUCCESS":
      return revealedMapOptions;
    case "FORFEIT":
      return !!targetCountryData
        ? {
            ...revealedMapOptions,
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
    default:
      return {};
  }
};

export const getNumberOfClicksOnLand = (clicks: Click[]) => {
  return clicks.filter((click) => !!click.countedClickNumber).length;
};

export const generateMarkerContent = (data: Click) => {
  const { featureName, countedClickNumber, winner } = data;

  const element = document.createElement("div");
  element.className = `click-marker ${
    winner
      ? "click-marker-success"
      : !countedClickNumber
        ? "click-marker-water"
        : ""
  }`;
  element.innerHTML = `${
    !!countedClickNumber ? `<b>${countedClickNumber}</b> | ` : ""
  }<b>${featureName}</b>`;

  return element;
};

export const convertKmToMi = (km: number) => {
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

export const getShareText = (
  clickStatus: ClickStatus,
  targetCountryName: string,
  targetCountryFlagEmoji: string,
  clickCount: number,
  campaignComplete: boolean
) =>
  campaignComplete
    ? `I found all ${campaignLength} countries in the Mapstery Quest! Play Mapstery!`
    : clickStatus === "CORRECT"
      ? `Rad! I found ${targetCountryName} ${targetCountryFlagEmoji} in ${clickCount} ${
          clickCount === 1 ? "try" : "tries"
        }. Play Mapstery!`
      : `Welp. I couldn't find ${targetCountryName} ${targetCountryFlagEmoji}. Play Mapstery!`;

// credit to https://dev.to/jorik/country-code-to-flag-emoji-a21
export const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const shareGameResult = async (shareText: string) => {
  try {
    await navigator.share({
      text: shareText,
      url: `https://mapstery.world`,
    });
  } catch (e) {
    return console.info(e);
  }
};

export const captureEvent = (
  eventName: AnalyticsEventType,
  data: AnalyticsEventData
) => {
  // console.info(eventName, data);
  posthog.capture(eventName, data);
};

export const generateCirclePoints = (
  center: google.maps.LatLng,
  radius: number
): google.maps.LatLng[] => {
  const numPoints = 100;
  const points: google.maps.LatLng[] = [];
  const angleStep = 360 / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    const point = google.maps.geometry.spherical.computeOffset(
      center,
      radius,
      angle
    );
    points.push(point);
  }
  // Close the circle by adding the first point again at the end
  points.push(points[0]);
  return points;
};

export const dottedLineSegment = (
  opacity: number
): google.maps.IconSequence => {
  return {
    icon: {
      path: "M 0,-1 0,1", // line (SVG path)
      scale: 3,
      strokeOpacity: opacity,
    },
    offset: "0",
    repeat: "30px", // Distance between dots
  };
};

export const getGameProgress = (
  gameCategory: GameCategory,
  delimiter: string = "/"
) =>
  `${getCountriesFoundList(gameCategory).length} ${delimiter} ${
    getFilteredCountryList(gameCategory, undefined, true).length
  }`;
