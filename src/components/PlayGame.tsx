import React, { useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Geonames from "geonames.js";
import posthog from "posthog-js";

import {
  GEONAMES_USERNAME,
  GEONAMES_TOKEN,
  GOOGLE_API_KEY,
  POSTHOG_API_KEY,
} from "../config";
import { GameplayMap } from "./GameplayMap";
import { ClickMarker } from "./ClickMarker";
import { Header } from "./Header";
import { LoadingSpinner } from "./LoadingSpinner";
import { GameplayModal, WelcomeModal } from "./modals";
import { NewGameButton, NextCountryButton } from "./buttons";
import {
  GameStatus,
  GameCategory,
  ClickStatus,
  Click,
  Country,
  ReverseGeolocatedCountry,
  ReverseGeolocatedBodyOfWater,
  AnalyticsEventData,
} from "../types";
import {
  generateMarkerContent,
  getNumberOfClicksOnLand,
  getRandomCountryData,
  addCountryToLocalStorageList,
  removeCountriesFoundList,
  getFilteredCountryList,
  captureEvent,
  isCampaignCompleted,
  getClickDistanceFromTarget,
} from "../utils";

posthog.init(POSTHOG_API_KEY, { api_host: "https://us.posthog.com" });

const render = (status: Status) => {
  if (status === Status.FAILURE) return <h1>Whoopsie. Try Again.</h1>;
  return (
    <div className="map-loading-container">
      <LoadingSpinner color="black" />
    </div>
  );
};

const geonames = Geonames({
  username: GEONAMES_USERNAME,
  token: GEONAMES_TOKEN,
  lan: "en",
  encoding: "JSON",
});

export const PlayGame: React.FC = () => {
  const [welcomeOverlayActive, setWelcomeOverlayActive] = useState(true);
  const [gameCategory, setGameCategory] = useState<GameCategory>();
  const [gameplayOverlayActive, setGameplayOverlayActive] = useState(false);
  const [clickStatus, setClickStatus] = useState<ClickStatus | null>(null);
  const [targetCountryData, setTargetCountryData] = useState<Country>();
  const [previousTargetCountry, setPreviousTargetCountry] = useState<string>();
  const [clickedCountryCode, setClickedCountryCode] = useState("");
  const [gameUnderway, setGameUnderway] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("PENDING");
  const [clicks, setClicks] = useState<Click[]>([]);
  const [revealedHintCount, setRevealedHintCount] = useState(1);
  const [latestClickDistance, setLatestClickDistance] = useState<number>();
  const [latestClickCoords, setLatestClickCoords] =
    useState<google.maps.LatLng>();

  useEffect(() => {
    const lastClickData = clicks[clicks.length - 1];

    if (!!lastClickData && !!targetCountryData) {
      setLatestClickDistance(
        getClickDistanceFromTarget(
          targetCountryData.latlng,
          lastClickData.coordinates
        )
      );

      setLatestClickCoords(lastClickData.coordinates);
    }
  }, [clicks]);

  const handleSetNewTargetCountry = (category: GameCategory) => {
    const randomCountryData = getRandomCountryData(
      category,
      previousTargetCountry
    );
    setPreviousTargetCountry(randomCountryData?.cca2);
    setTargetCountryData(randomCountryData);
  };

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
    countryData?: ReverseGeolocatedCountry,
    bodyOfWaterData?: ReverseGeolocatedBodyOfWater
  ) => {
    const clickEventData: AnalyticsEventData = {
      target: targetCountryData?.name.common,
      gameStatus: "SEARCH",
      gameCategory,
    };

    if (!!bodyOfWaterData) {
      captureEvent("MAP_CLICK", {
        ...clickEventData,
        countedClicks: getNumberOfClicksOnLand(clicks),
        overallClicks: clicks.length + 1,
        clickedFeature: bodyOfWaterData.ocean.name,
      });
      setClicks((currentClicks) => [
        ...currentClicks,
        { coordinates, featureName: bodyOfWaterData.ocean.name },
      ]);
      return;
    }

    if (!countryData) {
      setGameplayOverlayActive(true);
      setClickStatus("NO_DATA");
      captureEvent("MAP_CLICK", {
        ...clickEventData,
        countedClicks: getNumberOfClicksOnLand(clicks),
        overallClicks: clicks.length,
        latLng: [coordinates.lat(), coordinates.lng()],
      });
      return;
    }

    const { countryCode, countryName } = countryData;
    setClickedCountryCode(countryCode);

    if (["SUCCESS", "FORFEIT"].includes(gameStatus)) {
      captureEvent("MAP_CLICK", {
        ...clickEventData,
        clickedFeature: countryName,
        gameStatus: "EXPLORE",
      });
      setGameplayOverlayActive(true);
      setClickStatus("EXPLORE");
      return;
    }

    if (countryCode !== targetCountryData?.cca2) {
      captureEvent("MAP_CLICK", {
        ...clickEventData,
        countedClicks: getNumberOfClicksOnLand(clicks) + 1,
        overallClicks: clicks.length + 1,
        clickedFeature: countryName,
      });
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
      addCountryToLocalStorageList(
        targetCountryData.cca2,
        gameCategory as GameCategory
      );
      setGameplayOverlayActive(true);
      setClickStatus("CORRECT");
      setGameStatus("SUCCESS");
      captureEvent("WIN", {
        ...clickEventData,
        countedClicks: getNumberOfClicksOnLand(clicks) + 1,
        overallClicks: clicks.length + 1,
        clickedFeature: countryName,
        gameCompleted:
          getFilteredCountryList(clickEventData.gameCategory as GameCategory)
            .length === 0,
      });
      setClicks((currentClicks) => [
        ...currentClicks,
        {
          featureName: countryName,
          coordinates,
          countedClickNumber: getNumberOfClicksOnLand(currentClicks) + 1,
          winner: true,
        },
      ]);
      return;
    }

    return;
  };

  const endGame = () => {
    setGameUnderway(false);
    setRevealedHintCount(1);
    setClickStatus(null);
    setClicks([]);
    setLatestClickCoords(undefined);
    setLatestClickDistance(undefined);
  };

  const replayGame = (category: GameCategory) => {
    endGame();
    setGameplayOverlayActive(true);
    setGameStatus("INIT");
    handleSetNewTargetCountry(category);
    captureEvent("REPLAY_GAME", {
      gameCategory: category,
    });
  };

  const resetGame = () => {
    endGame();
    setGameStatus("PENDING");
    setWelcomeOverlayActive(true);
    setGameplayOverlayActive(false);
    setTargetCountryData(undefined);
    setLatestClickCoords(undefined);
    setLatestClickDistance(undefined);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {gameUnderway && !!targetCountryData && (
        <Header
          clicks={clicks}
          targetCountryData={targetCountryData}
          gameCategory={gameCategory as GameCategory}
          gameStatus={gameStatus}
          distanceFromTarget={latestClickDistance}
        />
      )}
      <WelcomeModal
        isOpen={!!welcomeOverlayActive}
        initializeGame={(category) => {
          setGameCategory(category);
          if (category === "MAPSTERY_QUEST" && isCampaignCompleted()) {
            removeCountriesFoundList("MAPSTERY_QUEST");
          } else if (category !== "MAPSTERY_QUEST") {
            removeCountriesFoundList(category);
          }
          handleSetNewTargetCountry(category);
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
            captureEvent("START_GAME", {
              gameCategory,
              target: targetCountryData?.name.common,
            });
          }}
          onForfeit={() => {
            setGameplayOverlayActive(false);
            setGameStatus("FORFEIT");
            captureEvent("FORFEIT", {
              target: targetCountryData?.name.common,
              countedClicks: getNumberOfClicksOnLand(clicks),
              overallClicks: clicks.length,
              gameCategory,
            });
            setTimeout(() => {
              setGameplayOverlayActive(true);
              setClickStatus("GIVE_UP");
            }, 1000);
          }}
          onReplay={() => replayGame(gameCategory)}
          onReset={resetGame}
          onRevealHint={() => setRevealedHintCount(revealedHintCount + 1)}
          revealedHintCount={revealedHintCount}
          clickCount={getNumberOfClicksOnLand(clicks)}
          clickStatus={clickStatus}
          clickedCountryCode={clickedCountryCode}
          targetCountryData={targetCountryData as Country}
          gameCategory={gameCategory}
        />
      )}

      {gameUnderway && !!gameCategory && (
        <div className="gameplay-button">
          {!["FORFEIT", "SUCCESS"].includes(gameStatus) ? (
            <button
              onClick={() => {
                setGameplayOverlayActive(true);
                setClickStatus("HINT");
                captureEvent("HINT_REQUEST", {
                  target: targetCountryData?.name.common,
                  gameCategory,
                });
              }}
              className="pure-button pure-button-primary"
            >
              Hint
            </button>
          ) : getFilteredCountryList(gameCategory).length > 0 ? (
            <NextCountryButton onClick={() => replayGame(gameCategory)} />
          ) : (
            <NewGameButton onClick={resetGame} />
          )}
        </div>
      )}

      <Wrapper
        apiKey={GOOGLE_API_KEY as string}
        render={render}
        libraries={["marker", "geometry"]}
        version="beta"
      >
        <GameplayMap
          style={{ height: "100%" }}
          onClick={onMapClick}
          gameStatus={gameStatus}
          gameCategory={gameCategory}
          targetCountryData={targetCountryData}
          distanceFromTarget={latestClickDistance}
          latestClickCoordinates={latestClickCoords}
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
