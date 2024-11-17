import React from "react";

import { BaseModal, BaseModalProps } from "./BaseModal";
import { CountrySpecsList } from "../CountrySpecsList";
import { CountryArea } from "../CountryArea";
import { NewGameButton, NextCountryButton } from "../buttons";
import {
  getCountryDataFromCca2Code,
  getBorderCountryList,
  getFlagEmoji,
  getShareText,
  isCampaignCompleted,
} from "../../utils";
import {
  ClickStatus,
  Country,
  GameCategory,
  GameCategoryList,
} from "../../types";
import {
  getCountriesFoundList,
  getFilteredCountryList,
  getGameProgress,
  shareGameResult,
  campaignLength,
} from "../../utils";

interface GameplayModalProps extends BaseModalProps {
  clickCount: number;
  clickStatus: ClickStatus | null;
  clickedCountryCode: string;
  targetCountryData: Country;
  revealedHintCount: number;
  gameCategory: GameCategory;
  onStartGame: () => void;
  onForfeit: () => void;
  onReplay: () => void;
  onRevealHint: () => void;
  onReset: () => void;
}

export const GameplayModal: React.FC<GameplayModalProps> = ({
  clickStatus,
  clickCount,
  clickedCountryCode,
  targetCountryData,
  revealedHintCount,
  gameCategory,
  onStartGame,
  onForfeit,
  onReplay,
  onRevealHint,
  onReset,
  ...props
}) => {
  const campaignHistoryCount = getCountriesFoundList("MAPSTERY_QUEST").length;

  if (!clickStatus)
    return (
      <BaseModal
        title={`Find ${targetCountryData.name.common}`}
        isOpen={!!props.isOpen}
      >
        <div>
          <img
            className="target-flag start-game"
            alt={`flag of ${targetCountryData.name.common}`}
            src={targetCountryData.flags.svg}
          />
        </div>
        {gameCategory === "MAPSTERY_QUEST" && !campaignHistoryCount && (
          <div style={{ fontSize: "125%", marginTop: "16px" }}>
            <div>
              You're on a Mapstery Quest to find every country in the world! Can
              you do it?
            </div>
          </div>
        )}
        <button
          style={{ fontSize: "125%", marginTop: "16px" }}
          onClick={onStartGame}
          className="pure-button button-secondary"
        >
          Let's Go!
        </button>
      </BaseModal>
    );

  if (clickStatus === "NO_DATA")
    return (
      <BaseModal
        isOpen={!!props.isOpen}
        title="You clicked on uncharted territory!"
      >
        <button
          style={{ fontSize: "125%", marginTop: "16px" }}
          onClick={props.onClose}
          className="pure-button button-secondary"
        >
          Keep Looking
        </button>
      </BaseModal>
    );

  if (clickStatus === "HINT")
    return (
      <BaseModal
        isOpen={!!props.isOpen}
        title={`About ${targetCountryData.name.common}`}
      >
        <button
          style={{ fontSize: "125%" }}
          onClick={onRevealHint}
          className="pure-button pure-button-primary"
          disabled={revealedHintCount === 6}
        >
          Show Another Hint
        </button>
        <div data-testid="hint-list" className="country-spec-list">
          <div>
            &#10147;{" "}
            {`${
              targetCountryData.latlng[0] > 0 ? "North" : "South"
            } of the Equator`}
          </div>
          {revealedHintCount > 1 && (
            <>
              <div>
                &#10147;{" "}
                {`${
                  targetCountryData.latlng[1] > 0 ? "East" : "West"
                } of the Prime Meridian`}
              </div>
            </>
          )}
          {revealedHintCount > 2 && (
            <div>&#10147; located in {targetCountryData.subregion}</div>
          )}
          {revealedHintCount > 3 && (
            <div>
              &#10147; has an area of{" "}
              <CountryArea area={targetCountryData.area} />
            </div>
          )}
          {revealedHintCount > 4 && (
            <div>
              &#10147;{" "}
              {targetCountryData.landlocked ? "landlocked" : "has a coastline"}
            </div>
          )}
          {revealedHintCount > 5 && (
            <div>
              &#10147;{" "}
              {!!targetCountryData.borders.length
                ? `shares a border with ${getBorderCountryList(
                    targetCountryData.borders
                  )}`
                : "does not share a border with any country"}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button
            onClick={props.onClose}
            className="pure-button button-secondary"
          >
            Keep Looking
          </button>
          <div>
            <button onClick={onForfeit} className="pure-button">
              Give Up
            </button>
          </div>
        </div>
      </BaseModal>
    );

  if (clickStatus === "EXPLORE")
    return (
      <BaseModal
        isOpen={!!props.isOpen}
        title={getCountryDataFromCca2Code(clickedCountryCode)?.name.common}
      >
        <CountrySpecsList
          countryMetadata={
            getCountryDataFromCca2Code(clickedCountryCode) as Country
          }
        />
        <hr style={{ maxWidth: "400px" }} />
        <div style={{ fontSize: "175%", margin: "1rem", marginTop: ".5rem" }}>
          <CurrentGameProgress gameCategory={gameCategory} />
        </div>
        <div className="modal-actions">
          <button
            onClick={props.onClose}
            className="pure-button button-secondary"
          >
            Keep Exploring
          </button>
          {getFilteredCountryList(gameCategory).length > 0 && (
            <NextCountryButton onClick={onReplay} />
          )}
          <NewGameButton onClick={onReset} />
        </div>
      </BaseModal>
    );

  return (
    <BaseModal
      isOpen={!!props.isOpen}
      title={`${
        clickStatus === "CORRECT" ? `Nice! You found ` : ""
      }${targetCountryData.name?.common}`}
    >
      <CountrySpecsList countryMetadata={targetCountryData} />
      <hr style={{ maxWidth: "400px" }} />
      <div style={{ fontSize: "175%", margin: "1rem", marginTop: ".5rem" }}>
        {getFilteredCountryList(gameCategory).length === 0 ? (
          gameCategory === "MAPSTERY_QUEST" ? (
            <>
              You completed the Mapstery Quest! You found all {campaignLength}
              countries! You're a Mapstery Master!
            </>
          ) : (
            <>
              You found all the countries in{" "}
              {
                GameCategoryList.find(
                  (category) => category.value === gameCategory
                )?.displayValue
              }
              ! You're a Mapstery Master!
            </>
          )
        ) : (
          <CurrentGameProgress gameCategory={gameCategory} />
        )}
      </div>
      <div className="modal-actions">
        {!!navigator.share && !!clickStatus && (
          <button
            onClick={() =>
              shareGameResult(
                getShareText(
                  clickStatus,
                  targetCountryData.name?.common,
                  getFlagEmoji(targetCountryData.cca2),
                  clickCount,
                  isCampaignCompleted()
                )
              )
            }
            className="pure-button"
          >
            Share
          </button>
        )}
        <button
          data-testid="explore-map-button"
          onClick={props.onClose}
          className="pure-button button-secondary"
        >
          Explore the Map
        </button>
        {getFilteredCountryList(gameCategory).length > 0 && (
          <NextCountryButton onClick={onReplay} />
        )}
        <NewGameButton onClick={onReset} />
      </div>
    </BaseModal>
  );
};

export const CurrentGameProgress: React.FC<{
  gameCategory: GameCategory;
}> = ({ gameCategory }) => (
  <div className="current-game-progress">
    {
      GameCategoryList.find((category) => category.value === gameCategory)
        ?.displayValue
    }{" "}
    &#10147; {getGameProgress(gameCategory, "of")} countries found
  </div>
);
