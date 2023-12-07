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
  const [selectedCategory, setSelectedCategory] =
    useState<GameCategory>("PLANET_EARTH");

  useEffect(() => {
    isOpen && setSelectedCategory("PLANET_EARTH");
  }, [isOpen]);

  return (
    <BaseModal isOpen={!!isOpen} title={"MAPSTERY"}>
      <div
        style={{
          fontSize: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        Select a Game
      </div>
      <div className="modal-actions">
        <form className="pure-form">
          <select
            defaultValue={"PLANET_EARTH"}
            name="categorySelect"
            style={{ height: "unset" }}
            onChange={(e) =>
              setSelectedCategory(e.target.value as GameCategory)
            }
          >
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
