import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Mock posthog before importing PlayGame
vi.mock("posthog-js");

// Mock all components and modules
vi.mock("../config", () => ({
  GOOGLE_API_KEY: "test-api-key",
  POSTHOG_API_KEY: "test-posthog-key",
}));

vi.mock("@googlemaps/react-wrapper", () => ({
  Wrapper: ({ children }: any) => React.createElement("div", null, children),
  Status: { FAILURE: "FAILURE" },
}));

vi.mock("../components/GameplayMap", () => ({
  GameplayMap: ({ onClick }: any) =>
    React.createElement("div", {
      "data-testid": "gameplay-map",
      onClick: () =>
        onClick({
          latLng: { lat: () => 40, lng: () => -74 },
        }),
    }),
}));

vi.mock("../components/ClickMarker", () => ({
  ClickMarker: () =>
    React.createElement("div", { "data-testid": "click-marker" }),
}));

vi.mock("../components/Header", () => ({
  Header: () => React.createElement("div", { "data-testid": "header" }),
}));

vi.mock("../components/LoadingSpinner", () => ({
  LoadingSpinner: () =>
    React.createElement("div", { "data-testid": "loading-spinner" }),
}));

vi.mock("../components/modals", () => ({
  GameplayModal: ({ onStartGame, onForfeit, onReplay }: any) =>
    React.createElement(
      "div",
      { "data-testid": "gameplay-modal" },
      React.createElement("button", {
        onClick: onStartGame,
        "data-testid": "start-game-btn",
        children: "Start Game",
      }),
      React.createElement("button", {
        onClick: onForfeit,
        "data-testid": "forfeit-btn",
        children: "Forfeit",
      }),
      React.createElement("button", {
        onClick: onReplay,
        "data-testid": "replay-btn",
        children: "Replay",
      })
    ),
  WelcomeModal: ({ initializeGame }: any) =>
    React.createElement(
      "div",
      { "data-testid": "welcome-modal" },
      React.createElement("button", {
        onClick: () => initializeGame("LARGEST_TO_SMALLEST_AREA"),
        "data-testid": "play-btn",
        children: "Play",
      })
    ),
}));

vi.mock("../components/buttons", () => ({
  NewGameButton: ({ onClick }: any) =>
    React.createElement("button", {
      onClick,
      "data-testid": "new-game-btn",
      children: "New Game",
    }),
  NextCountryButton: ({ onClick }: any) =>
    React.createElement("button", {
      onClick,
      "data-testid": "next-country-btn",
      children: "Next Country",
    }),
}));

vi.mock("../utils", () => ({
  getNextCountryData: vi.fn(),
  getRandomCountryData: vi.fn(),
  getFilteredCountryList: vi.fn(),
  getNumberOfClicksOnLand: vi.fn(),
  reverseGeolocateCoordinates: vi.fn(),
  captureEvent: vi.fn(),
  isCampaignCompleted: vi.fn(),
  getClickDistanceFromTarget: vi.fn(),
  generateMarkerContent: vi.fn(),
  removeCountriesFoundList: vi.fn(),
  addCountryToLocalStorageList: vi.fn(),
}));

vi.mock("../hooks/useGetAverageClicksToFindCountry", () => ({
  useGetAverageClicksToFindCountry: vi.fn(),
}));

// Import after mocks
import { PlayGame } from "../components/PlayGame";
import * as utils from "../utils";
import * as hooks from "../hooks/useGetAverageClicksToFindCountry";

const mockCountryData = {
  name: { common: "Test Country" },
  cca2: "TC",
  cca3: "TST",
  area: 100000,
  population: 5000000,
  latlng: [40, -74],
};

describe("PlayGame Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (hooks.useGetAverageClicksToFindCountry as any).mockReturnValue({
      averageClicks: 3,
      loading: false,
    });
    (utils.getNextCountryData as any).mockReturnValue(mockCountryData);
    (utils.getRandomCountryData as any).mockReturnValue(mockCountryData);
    (utils.getFilteredCountryList as any).mockReturnValue([mockCountryData]);
    (utils.getNumberOfClicksOnLand as any).mockReturnValue(0);
    (utils.reverseGeolocateCoordinates as any).mockResolvedValue({
      countryCode: "TC",
      countryName: "Test Country",
    });
    (utils.captureEvent as any).mockReturnValue(undefined);
    (utils.isCampaignCompleted as any).mockReturnValue(false);
    (utils.getClickDistanceFromTarget as any).mockReturnValue(500);
    (utils.generateMarkerContent as any).mockReturnValue(
      document.createElement("div")
    );
    (utils.removeCountriesFoundList as any).mockReturnValue(undefined);
    (utils.addCountryToLocalStorageList as any).mockReturnValue(undefined);
  });

  test("should call getNextCountryData when initializing game", async () => {
    render(React.createElement(PlayGame));
    const playBtn = screen.getByTestId("play-btn");
    fireEvent.click(playBtn);

    await waitFor(() => {
      expect(utils.getNextCountryData).toHaveBeenCalled();
    });
  });

  test("Game sequence: Welcome → Initialize → Start Game", async () => {
    const apiCallOrder: string[] = [];

    (utils.removeCountriesFoundList as any).mockImplementation(() => {
      apiCallOrder.push("removeCountriesFoundList");
    });

    (utils.getNextCountryData as any).mockImplementation(() => {
      apiCallOrder.push("getNextCountryData");
      return mockCountryData;
    });

    render(React.createElement(PlayGame));
    const playBtn = screen.getByTestId("play-btn");
    fireEvent.click(playBtn);

    await waitFor(() => {
      expect(apiCallOrder.length).toBeGreaterThan(0);
    });
  });

  test("Correct guess", async () => {
    const apiCallOrder: string[] = [];

    (utils.reverseGeolocateCoordinates as any).mockImplementation(() => {
      apiCallOrder.push("reverseGeolocateCoordinates");
      return Promise.resolve({
        countryCode: "TC",
        countryName: "Test Country",
      });
    });

    (utils.addCountryToLocalStorageList as any).mockImplementation(() => {
      apiCallOrder.push("addCountryToLocalStorageList");
    });

    (utils.captureEvent as any).mockImplementation((event: string) => {
      if (event === "WIN") {
        apiCallOrder.push("captureEvent:WIN");
      }
    });

    render(React.createElement(PlayGame));
    const playBtn = screen.getByTestId("play-btn");
    fireEvent.click(playBtn);

    await waitFor(() => {
      expect(screen.getByTestId("start-game-btn")).toBeInTheDocument();
    });

    const startBtn = screen.getByTestId("start-game-btn");
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByTestId("gameplay-map")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("gameplay-map"));

    await waitFor(() => {
      expect(apiCallOrder).toContain("reverseGeolocateCoordinates");
    });
  });

  test("Water click → countrySubdivisionJSON → oceanJSON called", async () => {
    const apiCallOrder: string[] = [];

    (utils.reverseGeolocateCoordinates as any).mockImplementation(
      (endpoint: string) => {
        apiCallOrder.push(`reverseGeolocateCoordinates:${endpoint}`);

        if (endpoint === "countrySubdivisionJSON") {
          // Return error status (no country found)
          return Promise.resolve({ status: { value: 15 } });
        }

        if (endpoint === "oceanJSON") {
          // Return ocean data
          return Promise.resolve({
            ocean: { name: "Atlantic Ocean" },
          });
        }
      }
    );

    (utils.captureEvent as any).mockImplementation((event: string) => {
      if (event === "MAP_CLICK") {
        apiCallOrder.push("captureEvent:MAP_CLICK");
      }
    });

    render(React.createElement(PlayGame));
    const playBtn = screen.getByTestId("play-btn");
    fireEvent.click(playBtn);

    await waitFor(() => {
      expect(screen.getByTestId("start-game-btn")).toBeInTheDocument();
    });

    const startBtn = screen.getByTestId("start-game-btn");
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByTestId("gameplay-map")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("gameplay-map"));

    await waitFor(() => {
      expect(apiCallOrder).toEqual([
        "reverseGeolocateCoordinates:countrySubdivisionJSON",
        "reverseGeolocateCoordinates:oceanJSON",
        "captureEvent:MAP_CLICK",
      ]);
    });
  });
});
