import React from "react";

import { convertKmtoMi, getRelativeCountrySize } from "../utils";

export const CountryArea: React.FC<{ area: number }> = ({ area }) => (
  <>
    {Intl.NumberFormat().format(area)} km
    <sup style={{ fontSize: "0.7em" }}>2</sup> /{" "}
    {Intl.NumberFormat().format(convertKmtoMi(area))} mi
    <sup style={{ fontSize: "0.7em" }}>2</sup>
    <span> ({getRelativeCountrySize(area)})</span>
  </>
);
