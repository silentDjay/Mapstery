import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { PlayGame } from "./PlayGame";
import { GameplayStats } from "./GameplayStats";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlayGame />} />
        <Route path="stats" element={<GameplayStats />} />
      </Routes>
    </BrowserRouter>
  );
};
