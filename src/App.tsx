import React, { useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Geonames from "geonames.js";
import TagManager from "react-gtm-module";

import { GEONAMES_USERNAME, GOOGLE_API_KEY, GOOGLE_TAG_ID } from "./config";
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
  ReverseGeocodedCountry,
} from "./types";
import { generateMarkerContent, getRandomCountryData } from "./utils";

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
      const clickedCountryData = await geonames.countryCode({
        lat: coordinates.lat(),
        lng: coordinates.lng(),
      }); // 'countrySubdivision' mostly works for US states (but not for NC or VA) - perhaps I can fix it, or there might be a different dataset I can use (or I can use google's reverse geolocation API for that game)
      registerClick(clickedCountryData, coordinates);
    } catch (err) {
      console.error(err);
    }
  };

  const registerClick = (
    countryData: ReverseGeocodedCountry,
    coordinates: google.maps.LatLng
  ) => {
    const code = countryData?.countryCode;
    const name = countryData?.countryName;

    if (!code) {
      setGameplayOverlayActive(true);
      setClickStatus("NO_DATA");
      return;
    }

    setClickedCountryCode(code);

    if (["SUCCESS", "FORFEIT"].includes(gameStatus)) {
      setGameplayOverlayActive(true);
      setClickStatus("EXPLORE");
      return;
    }

    if (code !== targetCountryData?.cca2) {
      setClicks([...clicks, { countryName: name, coordinates }]);
      return;
    }

    if (code === targetCountryData?.cca2) {
      setGameplayOverlayActive(true);
      setClickStatus("CORRECT");
      setGameStatus("SUCCESS");
      setClicks([...clicks, { countryName: name, coordinates, winner: true }]);
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
          clickCount={clicks.length || 0}
          clickStatus={clickStatus}
          clickedCountryCode={clickedCountryCode}
          targetCountryData={targetCountryData as Country}
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
          targetCountryData={targetCountryData}
        >
          {clicks.map((click, i) => (
            <ClickMarker
              key={i}
              position={click.coordinates}
              title={click.countryName}
              content={generateMarkerContent(
                click.countryName,
                i,
                !!click.winner
              )}
            />
          ))}
        </GameplayMap>
      </Wrapper>
    </div>
  );
};
