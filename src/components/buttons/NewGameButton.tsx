import React from "react";

export const NewGameButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button
    data-testid="new-game-button"
    onClick={onClick}
    className="pure-button"
  >
    New Game
  </button>
);
