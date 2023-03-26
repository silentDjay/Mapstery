import React from "react";

import { BaseModal, BaseModalProps } from "./BaseModal";
import { CountrySpecsList } from "../CountrySpecsList";
import { CountryArea } from "../CountryArea";
import {
  getCountryDataFromCca2Code,
  getBorderCountryList,
  getCountryHemispheres,
  getFlagEmoji,
  getShareText,
} from "../../utils";
import { ClickStatus, Country } from "../../types";
import {
  getCampaignHistory,
  resetCampaignHistory,
  shareGameResult,
  campaignLength,
} from "../../utils";

interface GameplayModalProps extends BaseModalProps {
  clickCount: number;
  clickStatus: ClickStatus | null;
  clickedCountryCode: string;
  targetCountryData: Country;
  revealedHintCount: number;
  campaignModeActive: boolean;
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
  campaignModeActive,
  onStartGame,
  onForfeit,
  onReplay,
  onRevealHint,
  onReset,
  ...props
}) => {
  const campaignHistoryCount = getCampaignHistory().length;
  const campaignCompleted =
    campaignModeActive && campaignHistoryCount === campaignLength;

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
        {campaignModeActive && (
          <div style={{ fontSize: "125%", marginTop: "16px" }}>
            {!!campaignHistoryCount ? (
              <div>
                You've found {campaignHistoryCount}{" "}
                {campaignHistoryCount > 1 ? "countries" : "country"} so far on
                your Mapstery Quest. Just{" "}
                {campaignLength - campaignHistoryCount} more to go!
              </div>
            ) : (
              <div>
                You're on a Mapstery Quest to find {campaignLength} countries!
                Can you do it?
              </div>
            )}
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
        {revealedHintCount < 5 && (
          <button
            style={{ fontSize: "125%" }}
            onClick={onRevealHint}
            className="pure-button pure-button-primary"
          >
            Show Another Hint
          </button>
        )}
        <div className="country-spec-list">
          <div>
            &#10147;{" "}
            {targetCountryData.landlocked ? "landlocked" : "not landlocked"}
          </div>
          {revealedHintCount > 1 && (
            <div>
              &#10147; has an area of{" "}
              <CountryArea area={targetCountryData.area} />
            </div>
          )}
          {revealedHintCount > 2 && (
            <div>
              &#10147; in the {getCountryHemispheres(targetCountryData.latlng)}{" "}
              Hemispheres
            </div>
          )}
          {revealedHintCount > 3 && (
            <div>&#10147; located in {targetCountryData.subregion}</div>
          )}
          {revealedHintCount > 4 && (
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
        <div className="modal-actions">
          <button
            onClick={props.onClose}
            className="pure-button button-secondary"
          >
            Keep Exploring
          </button>
          {!campaignCompleted && (
            <button
              onClick={onReplay}
              className="pure-button pure-button-primary"
            >
              Play Again
            </button>
          )}
          <button
            onClick={() => {
              if (campaignCompleted) resetCampaignHistory();
              onReset();
            }}
            className="pure-button"
          >
            New Game
          </button>
        </div>
      </BaseModal>
    );

  return (
    <BaseModal
      isOpen={!!props.isOpen}
      title={`${clickStatus === "CORRECT" ? `Nice! You found ` : ""}${
        targetCountryData.name?.common
      }`}
    >
      {campaignCompleted ? (
        <div style={{ fontSize: "175%", margin: "1rem" }}>
          You completed the Mapstery Quest! You found all {campaignLength}
          countries! You're a Mapstery Master!
        </div>
      ) : (
        <CountrySpecsList countryMetadata={targetCountryData} />
      )}
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
                  campaignCompleted
                )
              )
            }
            className="pure-button"
          >
            Share
          </button>
        )}
        <button
          onClick={props.onClose}
          className="pure-button button-secondary"
        >
          Explore the Map
        </button>
        {!campaignCompleted && (
          <button
            onClick={onReplay}
            className="pure-button pure-button-primary"
          >
            Play Again
          </button>
        )}
        <button
          onClick={() => {
            if (campaignCompleted) resetCampaignHistory();
            onReset();
          }}
          className="pure-button"
        >
          New Game
        </button>
      </div>
    </BaseModal>
  );
};
