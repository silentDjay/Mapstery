import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "../components";

test("renders Mapstery heading", () => {
  render(<App />);

  const linkElement = screen.getByText("MAPSTERY");
  expect(linkElement).toBeInTheDocument();
});

test("initiate countries game ", () => {
  render(<App />);

  const categorySelect = screen.getByText("Select a Game");
  expect(categorySelect).toBeInTheDocument;

  const initGameButton = screen.getByText("Play");
  userEvent.click(initGameButton);

  const letsGoButton = screen.getByText("Let's Go!");
  expect(letsGoButton).toBeInTheDocument;
  userEvent.click(letsGoButton);

  const hintButton = screen.getByText("Hint");
  expect(hintButton).toBeInTheDocument;
});

test("display all hints for a country", () => {
  render(<App />);

  const initGameButton = screen.getByText("Play");
  userEvent.click(initGameButton);

  const letsGoButton = screen.getByText("Let's Go!");
  userEvent.click(letsGoButton);

  const hintButton = screen.getByText("Hint");
  userEvent.click(hintButton);

  const revealHintButton = screen.getByText("Show Another Hint");
  expect(revealHintButton).toBeInTheDocument;

  const hintList = screen.getByTestId("hint-list");
  expect(hintList).toBeInTheDocument;

  for (var i = 0; i < 6; i++) {
    expect(
      within(hintList).getAllByText("➣", {
        exact: false,
      }).length
    ).toBe(i + 1);

    userEvent.click(revealHintButton);
  }

  expect(
    within(hintList).getAllByText("➣", {
      exact: false,
    }).length
  ).toBe(6);
});

test("forfeit a game", async () => {
  render(<App />);

  const initGameButton = screen.getByText("Play");
  userEvent.click(initGameButton);

  const letsGoButton = screen.getByText("Let's Go!");
  userEvent.click(letsGoButton);

  const hintButton = screen.getByText("Hint");
  userEvent.click(hintButton);

  const forfeitButton = screen.getByText("Give Up");
  expect(forfeitButton).toBeInTheDocument;
  userEvent.click(forfeitButton);

  await waitFor(() => screen.getByTestId("explore-map-button"));

  const exploreMap = screen.getByTestId("explore-map-button");
  const playAgain = screen.getAllByTestId("play-again-button");
  const newGame = screen.getByTestId("new-game-button");

  expect(exploreMap).toBeInTheDocument;
  expect(playAgain).toHaveLength(2);
  expect(newGame).toBeInTheDocument;
});
