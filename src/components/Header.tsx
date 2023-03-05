import React from "react";

import { Click, Country } from "../types";
import { getClickDistanceFromTarget } from "../utils";

interface HeaderProps {
  clicks: Click[];
  targetCountryData: Country;
  targetCountryFound: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  clicks,
  targetCountryData,
  targetCountryFound,
}) => {
  const clickCount = clicks.length;
  const lastClickData = clicks[clickCount - 1];
  const penultimateClickData = clicks[clickCount - 2];
  const distanceFromTarget =
    !!targetCountryData &&
    !!lastClickData &&
    getClickDistanceFromTarget(
      targetCountryData.latlng,
      lastClickData.coordinates
    );
  const previousClickDistance =
    !!targetCountryData &&
    !!penultimateClickData &&
    getClickDistanceFromTarget(
      targetCountryData.latlng,
      penultimateClickData.coordinates
    );
  const gettingWarmer =
    !!distanceFromTarget && !!previousClickDistance
      ? distanceFromTarget < previousClickDistance
      : undefined;

  return (
    <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
      <span className="header-title">MAPSTERY</span>
      {!!targetCountryData && (
        <div className="header-gameplay-info">
          {clicks?.length !== 0 && !targetCountryFound && !!lastClickData && (
            <div style={{ display: "flex" }}>
              <div>
                <b>
                  Last Guess: {lastClickData.countryName}{" "}
                  {!!distanceFromTarget && (
                    <span
                      style={{
                        color:
                          typeof gettingWarmer === "boolean"
                            ? gettingWarmer
                              ? "green"
                              : "red"
                            : undefined,
                      }}
                    >
                      (
                      {distanceFromTarget < 1
                        ? "<1"
                        : Intl.NumberFormat().format(
                            Math.round(distanceFromTarget)
                          )}{" "}
                      km away)
                    </span>
                  )}
                </b>
              </div>
              <div style={{ margin: "0 0.5rem" }}>|</div>
            </div>
          )}
          <div style={{ marginRight: "0.5rem" }}>
            <b>
              {!targetCountryFound
                ? targetCountryData.name.common
                : `You found ${
                    targetCountryData.name.common
                  } in ${clickCount} ${clickCount === 1 ? "Try" : "Tries"}`}
            </b>
          </div>
          <img
            className="flag"
            alt={`flag of ${targetCountryData.name.common}`}
            src={targetCountryData.flags.svg}
          />
        </div>
      )}
    </div>
  );
};