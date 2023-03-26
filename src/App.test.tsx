import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "./App";

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

  const gameplayButton = screen.getByText("Hint");
  expect(gameplayButton).toBeInTheDocument;
});
