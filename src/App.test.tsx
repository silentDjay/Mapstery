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

  const countriesGameButton = screen.getByText("Countries of the World");
  userEvent.click(countriesGameButton);

  const letsGoButton = screen.getByText("Let's Go!");
  expect(letsGoButton).toBeInTheDocument;
  userEvent.click(letsGoButton);

  const gameplayButton = screen.getByText("Hint");
  expect(gameplayButton).toBeInTheDocument;
});
