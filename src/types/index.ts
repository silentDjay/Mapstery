export type GameStatus = "PENDING" | "INIT" | "SUCCESS" | "FORFEIT";

export type ClickStatus =
  | "NO_DATA"
  | "HINT"
  | "CORRECT"
  | "GIVE_UP"
  | "EXPLORE";

export interface Click {
  countryCode: string;
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
