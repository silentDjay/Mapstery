import React from "react";

import { CountryArea } from "./CountryArea";
import { getBorderCountryList, getRelativeCountrySize } from "../utils";
import { Country } from "../types";

export const CountrySpec: React.FC<{
  label: string;
  data: string | JSX.Element;
}> = ({ label, data }) => (
  <div style={{ marginTop: ".5rem" }}>
    &#10147; {label}: <b>{data}</b>
  </div>
);

export const CountrySpecsList: React.FC<{ countryMetadata: Country }> = ({
  countryMetadata,
}) => (
  <div className="country-spec-list">
    <img
      className="target-flag"
      alt={`flag of ${countryMetadata.name.common}`}
      src={countryMetadata.flags.svg}
    />
    <CountrySpec label="Official Name" data={countryMetadata.name.official} />
    <CountrySpec
      label="Population"
      data={Intl.NumberFormat().format(countryMetadata.population)}
    />
    <CountrySpec
      label="Area"
      data={<CountryArea area={countryMetadata.area} />}
    />
    <CountrySpec
      label={
        countryMetadata.capital.length > 1 ? "Capital Cities" : "Capital City"
      }
      data={countryMetadata.capital.join(", ") || "N/A"}
    />
    <CountrySpec
      label="Currencies"
      data={
        Object.values(countryMetadata.currencies)
          .map((currency) => `${currency.name} (${currency.symbol})`)
          .join(", ") || "N/A"
      }
    />
    <CountrySpec
      label="Official Languages"
      data={
        Object.values(countryMetadata.languages)
          .map((language) => language)
          .join(", ") || "N/A"
      }
    />
    <CountrySpec
      label="Borders"
      data={getBorderCountryList(countryMetadata.borders) || "None"}
    />
    <CountrySpec
      label="Demonym"
      data={countryMetadata.demonyms.eng.f || "N/A"}
    />
    <CountrySpec label="Drives on the" data={countryMetadata.car.side} />
  </div>
);
