import React from "react";

import { BaseModal, BaseModalProps } from "./BaseModal";
import { CountrySpecsList } from "../CountrySpecsList";
import { CountryArea } from "../CountryArea";
import {
  getCountryDataFromCca2Code,
  getBorderCountryList,
  getCountryHemispheres,
} from "../../utils";
import { ClickStatus, Country } from "../../types";

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
        <img
          className="target-flag"
          alt={`flag of ${targetCountryData.name.common}`}
          src={targetCountryData.flags.svg}
        />
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
        <div
          className="country-spec-list"
          style={{ fontSize: "2rem", margin: "1rem" }}
        >
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
        <button
          style={{ fontSize: "125%", marginTop: "16px" }}
          onClick={props.onClose}
          className="pure-button button-secondary"
        >
          Keep Looking
        </button>
        {revealedHintCount < 5 && (
          <button
            style={{ fontSize: "125%", marginTop: "16px", marginLeft: "2rem" }}
            onClick={onRevealHint}
            className="pure-button pure-button-primary"
          >
            Show Another Hint
          </button>
        )}
        <div>
          <button
            style={{ fontSize: "125%", marginTop: "16px" }} //, marginLeft: "2rem" }}
            onClick={onForfeit}
            className="pure-button"
          >
            Give Up
          </button>
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
        <button
          style={{ fontSize: "125%", marginTop: "16px" }}
          onClick={props.onClose}
          className="pure-button button-secondary"
        >
          Keep Exploring
        </button>
        <button
          style={{ fontSize: "125%", marginTop: "16px", marginLeft: "2rem" }}
          onClick={onReplay}
          className="pure-button pure-button-primary"
        >
          Play Again
        </button>
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
      <button
        style={{ fontSize: "125%", marginTop: "16px" }}
        onClick={props.onClose}
        className="pure-button button-secondary"
      >
        Explore the Map
      </button>
      <button
        style={{ fontSize: "125%", marginTop: "16px", marginLeft: "2rem" }}
        onClick={onReplay}
        className="pure-button pure-button-primary"
      >
        Play Again
      </button>
    </BaseModal>
  );
};
