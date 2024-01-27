export type GameCategory =
  | "PLANET_EARTH"
  | "AFRICA"
  | "ANTARCTIC"
  | "ASIA"
  | "EUROPE"
  | "NORTH_AMERICA"
  | "CARIBBEAN"
  | "SOUTH_AMERICA"
  | "OCEANIA"
  | "ISLAND_COUNTRIES"
  | "LANDLOCKED_COUNTRIES"
  | "LARGE_COUNTRIES"
  | "SMALL_COUNTRIES"
  | "POPULOUS_COUNTRIES"
  | "NON_POPULOUS_COUNTRIES"
  | "MAPSTERY_QUEST";

export const GameCategoryList: {
  value: GameCategory;
  displayValue: string;
}[] = [
  { value: "PLANET_EARTH", displayValue: "Countries of the World" },
  { value: "AFRICA", displayValue: "Africa" },
  { value: "ANTARCTIC", displayValue: "The Antarctic" },
  { value: "ASIA", displayValue: "Asia" },
  { value: "EUROPE", displayValue: "Europe" },
  { value: "NORTH_AMERICA", displayValue: "North America" },
  { value: "CARIBBEAN", displayValue: "The Caribbean" },
  { value: "SOUTH_AMERICA", displayValue: "South America" },
  { value: "OCEANIA", displayValue: "Oceania" },
  { value: "ISLAND_COUNTRIES", displayValue: "Island Countries Only" },
  { value: "LANDLOCKED_COUNTRIES", displayValue: "Landlocked Countries Only" },
  {
    value: "LARGE_COUNTRIES",
    displayValue: "Large Countries Only",
  },
  {
    value: "SMALL_COUNTRIES",
    displayValue: "Small Countries Only",
  },
  {
    value: "POPULOUS_COUNTRIES",
    displayValue: "Countries with >100 Million Inhabitants",
  },
  {
    value: "NON_POPULOUS_COUNTRIES",
    displayValue: "Countries with <50,000 Inhabitants",
  },
  {
    value: "MAPSTERY_QUEST",
    displayValue: "The Mapstery Quest",
  },
];

export type GameStatus = "PENDING" | "INIT" | "SUCCESS" | "FORFEIT";

export type ClickStatus =
  | "NO_DATA"
  | "HINT"
  | "CORRECT"
  | "GIVE_UP"
  | "EXPLORE";

export interface Click {
  featureName: string;
  coordinates: google.maps.LatLng;
  countedClickNumber?: number;
  winner?: boolean;
}

export type Coordinates = [number, number];

export interface Country {
  flags: {
    png: string;
    svg: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: { common: string; official: string };
    };
  };
  cca2: string;
  cca3: string;
  currencies: { [key: string]: { name: string; symbol: string } };
  capital: string[];
  subregion: string;
  languages: { [key: string]: string };
  latlng: Coordinates;
  landlocked: boolean;
  borders: string[];
  area: number;
  demonyms: {
    [key: string]: { f: string; m: string };
  };
  population: number;
  car: { signs: string[]; side: "left" | "right" };
}

interface SubdivisionCode {
  code: string;
  level: string;
  type: string;
}

export interface ReverseGeoclocatedCountry {
  adminCode1: string;
  adminName1: string;
  codes: SubdivisionCode[];
  countryCode: string;
  countryName: string;
  distance: number;
}

export interface ReverseGeoclocatedBodyOfWater {
  ocean: {
    distance: string;
    geonameId: number;
    name: string;
  };
}

export type AnalyticsEventType =
  | "MAP_CLICK"
  | "FORFEIT"
  | "WIN"
  | "START_GAME"
  | "REPLAY_GAME"
  | "HINT_REQUEST";

export interface AnalyticsEventData {
  gameCategory: GameCategory | undefined;
  target: string | undefined;
  countedClicks?: number;
  overallClicks?: number;
  clickedFeature?: string | undefined;
  gameStatus?: "SEARCH" | "EXPLORE";
  latLng?: [number, number];
}
