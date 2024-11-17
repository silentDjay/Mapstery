import React from "react";

export const NextCountryButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button
    data-testid="keep-playing-button"
    onClick={onClick}
    className="pure-button pure-button-primary"
  >
    Find Next Country
  </button>
);
