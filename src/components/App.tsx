import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import { PlayGame } from "./PlayGame";
import { GameplayStats } from "./GameplayStats";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlayGame />} />
        <Route path="stats" element={<GameplayStats />} />
      </Routes>
    </HashRouter>
  );
};
