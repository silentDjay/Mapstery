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
  | "NON_POPULOUS_COUNTRIES";

export const GameCategoryList: {
  value: Partial<GameCategory>;
  displayValue: string;
}[] = [
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
    displayValue: "Countries with >30 Million Inhabitants",
  },
  {
    value: "NON_POPULOUS_COUNTRIES",
    displayValue: "Countries with <50,000 Inhabitants",
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
  countryName: string;
  coordinates: google.maps.LatLng;
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

export interface ReverseGeocodedCountry {
  countryCode: string;
  countryName: string;
  distance: string;
  languages: string;
}
