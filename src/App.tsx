import React, { useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Geonames from "geonames.js";
import TagManager from "react-gtm-module";

import {
  GEONAMES_USERNAME,
  GEONAMES_TOKEN,
  GOOGLE_API_KEY,
  GOOGLE_TAG_ID,
} from "./config";
import {
  GameplayMap,
  ClickMarker,
  GameplayModal,
  WelcomeModal,
  Header,
} from "./components";
import {
  GameStatus,
  GameCategory,
  ClickStatus,
  Click,
  Country,
  ReverseGeoclocatedCountry,
  ReverseGeoclocatedBodyOfWater,
} from "./types";
import {
  generateMarkerContent,
  getNumberOfClicksOnLand,
  getRandomCountryData,
  handleCountryFoundInCampaign,
  getCampaignHistory,
  resetCampaignHistory,
  campaignLength,
} from "./utils";

const tagManagerArgs = {
  gtmId: GOOGLE_TAG_ID,
};

TagManager.initialize(tagManagerArgs);

const render = (status: Status) => {
  return (
    <h1 className="header-title" style={{ textAlign: "center" }}>
      {status === "LOADING" ? "Loading Game" : "Whoopsie. Try Again."}
    </h1>
  );
};

const geonames = Geonames({
  username: GEONAMES_USERNAME,
  token: GEONAMES_TOKEN,
  lan: "en",
  encoding: "JSON",
});

export const App: React.FC = () => {
  const [welcomeOverlayActive, setWelcomeOverlayActive] = useState(true);
  const [gameCategory, setGameCategory] = useState<GameCategory>();
  const [gameplayOverlayActive, setGameplayOverlayActive] = useState(false);
  const [clickStatus, setClickStatus] = useState<ClickStatus | null>(null);
  const [targetCountryData, setTargetCountryData] = useState<Country>();
  const [clickedCountryCode, setClickedCountryCode] = useState("");
  const [gameUnderway, setGameUnderway] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("PENDING");
  const [clicks, setClicks] = useState<Click[]>([]);
  const [revealedHintCount, setRevealedHintCount] = useState(1);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    geolocateClickCoords(e.latLng!);
  };

  const geolocateClickCoords = async (coordinates: google.maps.LatLng) => {
    try {
      const clickedCountryData = await geonames.countrySubdivision({
        lat: coordinates.lat(),
        lng: coordinates.lng(),
      });

      // 15 is the status when no country is reverse geolocated
      if (clickedCountryData?.status?.value === 15) {
        geolocateBodyOfWater(coordinates);
        return;
      }

      handleGeolocatedClickData(coordinates, clickedCountryData);
    } catch (err) {
      console.error(err);
    }
  };

  const geolocateBodyOfWater = async (coordinates: google.maps.LatLng) => {
    try {
      const clickedBodyOfWaterData = await geonames.ocean({
        lat: coordinates.lat(),
        lng: coordinates.lng(),
      });

      // 15 is the status when no ocean is reverse geolocated
      if (clickedBodyOfWaterData?.status?.value === 15) {
        handleGeolocatedClickData(coordinates);
        return;
      }

      handleGeolocatedClickData(coordinates, undefined, clickedBodyOfWaterData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeolocatedClickData = (
    coordinates: google.maps.LatLng,
    countryData?: ReverseGeoclocatedCountry,
    bodyOfWaterData?: ReverseGeoclocatedBodyOfWater
  ) => {
    if (!!bodyOfWaterData) {
      setClicks((currentClicks) => [
        ...currentClicks,
        { coordinates, featureName: bodyOfWaterData.ocean.name },
      ]);
      return;
    }

    if (!countryData) {
      setGameplayOverlayActive(true);
      setClickStatus("NO_DATA");
      return;
    }

    const { countryCode, countryName } = countryData;
    setClickedCountryCode(countryCode);

    if (["SUCCESS", "FORFEIT"].includes(gameStatus)) {
      setGameplayOverlayActive(true);
      setClickStatus("EXPLORE");
      return;
    }

    if (countryCode !== targetCountryData?.cca2) {
      setClicks((currentClicks) => [
        ...currentClicks,
        {
          coordinates,
          featureName: countryName,
          countedClickNumber: getNumberOfClicksOnLand(currentClicks) + 1,
        },
      ]);
      return;
    }

    if (countryCode === targetCountryData?.cca2) {
      setGameplayOverlayActive(true);
      setClickStatus("CORRECT");
      setGameStatus("SUCCESS");
      setClicks((currentClicks) => [
        ...currentClicks,
        {
          featureName: countryName,
          coordinates,
          countedClickNumber: getNumberOfClicksOnLand(currentClicks) + 1,
          winner: true,
        },
      ]);
      handleCountryFoundInCampaign(targetCountryData.cca2);
      return;
    }

    return;
  };

  const endGame = () => {
    setGameUnderway(false);
    setRevealedHintCount(1);
    setClickStatus(null);
    setClicks([]);
  };

  const replayGame = (category: GameCategory) => {
    endGame();
    setGameplayOverlayActive(true);
    setGameStatus("INIT");
    setTargetCountryData(getRandomCountryData(category));
  };

  const resetGame = () => {
    endGame();
    setGameStatus("PENDING");
    setWelcomeOverlayActive(true);
    setGameplayOverlayActive(false);
    setTargetCountryData(undefined);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {gameUnderway && !!targetCountryData && (
        <Header
          clicks={clicks}
          targetCountryData={targetCountryData}
          targetCountryFound={gameStatus === "SUCCESS"}
        />
      )}
      <WelcomeModal
        isOpen={!!welcomeOverlayActive}
        initializeGame={(category) => {
          setGameCategory(category);
          setTargetCountryData(getRandomCountryData(category));
          setWelcomeOverlayActive(false);
          setGameplayOverlayActive(true);
        }}
      />
      {gameplayOverlayActive && !!gameCategory && (
        <GameplayModal
          isOpen={!!gameplayOverlayActive}
          onClose={() => {
            setGameplayOverlayActive(false);
          }}
          onStartGame={() => {
            setGameStatus("INIT");
            setGameplayOverlayActive(false);
            setGameUnderway(true);
          }}
          onForfeit={() => {
            setGameplayOverlayActive(false);
            setGameStatus("FORFEIT");
            setTimeout(() => {
              setGameplayOverlayActive(true);
              setClickStatus("GIVE_UP");
            }, 2000);
          }}
          onReplay={() => replayGame(gameCategory)}
          onReset={resetGame}
          onRevealHint={() => setRevealedHintCount(revealedHintCount + 1)}
          revealedHintCount={revealedHintCount}
          clickCount={getNumberOfClicksOnLand(clicks)}
          clickStatus={clickStatus}
          clickedCountryCode={clickedCountryCode}
          targetCountryData={targetCountryData as Country}
          campaignModeActive={gameCategory === "MAPSTERY_QUEST"}
        />
      )}

      {gameUnderway && !!gameCategory && (
        <div className="gameplay-button">
          {!["FORFEIT", "SUCCESS"].includes(gameStatus) ? (
            <button
              onClick={() => {
                setGameplayOverlayActive(true);
                setClickStatus("HINT");
              }}
              className="pure-button pure-button-primary"
            >
              Hint
            </button>
          ) : gameCategory === "MAPSTERY_QUEST" &&
            getCampaignHistory().length === campaignLength ? (
            <button
              onClick={() => {
                resetCampaignHistory();
                resetGame();
              }}
              className="pure-button pure-button-primary"
            >
              New Game
            </button>
          ) : (
            <button
              onClick={() => replayGame(gameCategory)}
              className="pure-button pure-button-primary"
            >
              Play Again
            </button>
          )}
        </div>
      )}

      <Wrapper
        apiKey={GOOGLE_API_KEY as string}
        render={render}
        libraries={["marker"]}
        version="beta"
      >
        <GameplayMap
          style={{ height: "100%" }}
          onClick={onMapClick}
          gameStatus={gameStatus}
          gameCategory={gameCategory}
          targetCountryData={targetCountryData}
        >
          {clicks.map((click, index) => (
            <ClickMarker
              key={index}
              position={click.coordinates}
              title={click.featureName}
              content={generateMarkerContent(click)}
            />
          ))}
        </GameplayMap>
      </Wrapper>
    </div>
  );
};
