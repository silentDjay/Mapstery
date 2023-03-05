import React from "react";

import { CountryArea } from "./CountryArea";
import { getBorderCountryList } from "../utils";
import { Country } from "../types";

export const CountrySpecsList: React.FC<{ countryMetadata: Country }> = ({
  countryMetadata,
}) => (
  <div className="country-spec-list">
    <img
      className="target-flag"
      alt={`flag of ${countryMetadata.name.common}`}
      src={countryMetadata.flags.svg}
    />
    <div style={{ marginTop: "1rem" }}>
      &#10147; Official Name: <b>{countryMetadata.name.official}</b>
    </div>
    <div>
      &#10147; Population:{" "}
      <b>{Intl.NumberFormat().format(countryMetadata.population)}</b>
    </div>
    <div>
      &#10147; Area:{" "}
      <b>
        <CountryArea area={countryMetadata.area} />
      </b>
    </div>
    <div>
      &#10147; Capital City: <b>{countryMetadata.capital.join(", ")}</b>
    </div>
    <div>
      &#10147; Currencies:{" "}
      <b>
        {Object.values(countryMetadata.currencies)
          .map((currency) => `${currency.name} (${currency.symbol})`)
          .join(", ")}
      </b>
    </div>
    <div>
      &#10147; Official Languages:{" "}
      <b>
        {Object.values(countryMetadata.languages)
          .map((language) => language)
          .join(", ")}
      </b>
    </div>
    <div>
      &#10147; Borders:{" "}
      <b>
        {!!countryMetadata.borders.length
          ? getBorderCountryList(countryMetadata.borders)
          : "None"}
      </b>
    </div>
    <div>
      &#10147; Demonym: <b>{countryMetadata.demonyms.eng.f}</b>
    </div>
    <div>
      &#10147; Drives on the: <b>{countryMetadata.car.side}</b>
    </div>
  </div>
);
