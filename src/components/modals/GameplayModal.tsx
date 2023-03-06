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
import { shareGameResult } from "../../utils";

interface GameplayModalProps extends BaseModalProps {
  clickCount: number;
  clickStatus: ClickStatus | null;
  clickedCountryCode: string;
  targetCountryData: Country;
  revealedHintCount: number;
  onStartGame: () => void;
  onForfeit: () => void;
  onReplay: () => void;
  onRevealHint: () => void;
}

export const GameplayModal: React.FC<GameplayModalProps> = ({
  clickStatus,
  clickCount,
  clickedCountryCode,
  targetCountryData,
  revealedHintCount,
  onStartGame,
  onForfeit,
  onReplay,
  onRevealHint,
  ...props
}) => {
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
        title="You clicked on unknown territory!"
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
          <button
            onClick={onReplay}
            className="pure-button pure-button-primary"
          >
            Play Again
          </button>
        </div>
      </BaseModal>
    );

  return (
    <BaseModal
      isOpen={!!props.isOpen}
      title={`${clickStatus === "CORRECT" ? `Great! You found ` : ""}${
        targetCountryData.name?.common
      }`}
    >
      <CountrySpecsList countryMetadata={targetCountryData} />
      <div className="modal-actions">
        {!!navigator.share && !!clickStatus && (
          <button
            onClick={() =>
              shareGameResult(
                getShareText(
                  clickStatus,
                  targetCountryData.name?.common,
                  getFlagEmoji(targetCountryData.cca2),
                  clickCount
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
        <button onClick={onReplay} className="pure-button pure-button-primary">
          Play Again
        </button>
      </div>
    </BaseModal>
  );
};
