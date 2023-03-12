import React, { useState, useEffect } from "react";

import { BaseModal, BaseModalProps } from "./BaseModal";
import { GameCategory, GameCategoryList } from "../../types";

interface WelcomeModalProps extends BaseModalProps {
  initializeGame: (category: GameCategory) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  initializeGame,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>();

  useEffect(() => {
    isOpen && setSelectedCategory(undefined);
  }, [isOpen]);

  return (
    <BaseModal isOpen={!!isOpen} title={"MAPSTERY"}>
      <button
        style={{ fontSize: "1.25rem", marginBottom: "1rem" }}
        onClick={() => initializeGame("PLANET_EARTH")}
        className="pure-button pure-button-primary"
      >
        Play Countries of the World
      </button>
      <div
        style={{
          fontSize: "1.25rem",
          fontStyle: "italic",
          marginBottom: "1rem",
        }}
      >
        or
      </div>
      <div className="modal-actions">
        <form className="pure-form">
          <select
            style={{ height: "unset" }}
            onChange={(e) =>
              setSelectedCategory(e.target.value as GameCategory)
            }
          >
            <option disabled selected>
              Select a Game
            </option>
            {GameCategoryList.map((category) => (
              <option key={category.value} value={category.value}>
                {category.displayValue}
              </option>
            ))}
          </select>
        </form>
        <button
          disabled={!selectedCategory}
          onClick={() => !!selectedCategory && initializeGame(selectedCategory)}
          className="pure-button button-secondary"
        >
          Play
        </button>
      </div>
    </BaseModal>
  );
};
