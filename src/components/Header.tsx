import React from "react";

import {
  Click,
  Country,
  GameCategory,
  GameCategoryList,
  GameStatus,
} from "../types";
import {
  getClickDistanceFromTarget,
  getGameProgress,
  getNumberOfClicksOnLand,
} from "../utils";

interface HeaderProps {
  clicks: Click[];
  targetCountryData: Country;
  gameCategory: GameCategory;
  gameStatus: GameStatus;
  distanceFromTarget?: number;
}

export const Header: React.FC<HeaderProps> = ({
  clicks,
  targetCountryData,
  gameCategory,
  gameStatus,
  distanceFromTarget,
}) => {
  const totalClickCount = clicks.length;
  const clickCountOnLand = getNumberOfClicksOnLand(clicks);
  const lastClickData = clicks[totalClickCount - 1];
  const penultimateClickData = clicks[totalClickCount - 2];
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
          {gameStatus === "INIT" && !!lastClickData ? (
            <div style={{ display: "flex" }}>
              <div>
                <b>
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
                      {distanceFromTarget < 1
                        ? "<1"
                        : Intl.NumberFormat().format(
                            Math.round(distanceFromTarget)
                          )}{" "}
                      km away
                    </span>
                  )}
                </b>
              </div>
              <div style={{ margin: "0 0.5rem" }}>|</div>
            </div>
          ) : (
            <div style={{ marginRight: "0.1rem" }}>
              <b>
                {
                  GameCategoryList.find(
                    (category) => category.value === gameCategory
                  )?.displayValue
                }{" "}
                <span>{getGameProgress(gameCategory)}</span>
              </b>{" "}
              &#10147;
            </div>
          )}
          <div style={{ marginRight: "0.5rem" }}>
            <b>
              {gameStatus === "SUCCESS"
                ? `You found ${
                    targetCountryData.name.common
                  } in ${clickCountOnLand} ${
                    clickCountOnLand === 1 ? "Try" : "Tries"
                  }`
                : targetCountryData.name.common}
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
