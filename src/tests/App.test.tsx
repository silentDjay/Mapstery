import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "../components";

test("renders Mapstery heading", () => {
  render(<App />);

  const linkElement = screen.getByText("MAPSTERY");
  expect(linkElement).toBeVisible();
});

test("initiate countries game ", () => {
  render(<App />);

  const categorySelect = screen.getByText("Select a Game");
  expect(categorySelect).toBeVisible;

  const initGameButton = screen.getByText("Play");
  userEvent.click(initGameButton);

  const letsGoButton = screen.getByText("Let's Go!");
  expect(letsGoButton).toBeVisible;
  userEvent.click(letsGoButton);

  const hintButton = screen.getByText("Hint");
  expect(hintButton).toBeVisible;
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
  expect(revealHintButton).toBeVisible;

  const hintList = screen.getByTestId("hint-list");
  expect(hintList).toBeVisible;

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
  expect(forfeitButton).toBeVisible;
  userEvent.click(forfeitButton);

  await waitFor(() => screen.getByTestId("explore-map-button"));

  const exploreMap = screen.getByTestId("explore-map-button");
  const playAgain = screen.getAllByTestId("keep-playing-button");
  const newGame = screen.getByTestId("new-game-button");

  expect(exploreMap).toBeVisible;
  expect(playAgain).toHaveLength(2);
  expect(newGame).toBeVisible;
});
