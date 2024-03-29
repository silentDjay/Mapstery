import React, { useState } from "react";
import { Link } from "react-router-dom";

import { LoadingSpinner } from "./LoadingSpinner";

interface ChartProps {
  label: JSX.Element;
  id: string;
  worldMap?: boolean;
}

const gameplayCharts: ChartProps[] = [
  {
    label: <span>Games Won &#10147; Location of User</span>,
    id: "NqmL5Snwmw4LZzZZvrLM4YurDoZFxg",
    worldMap: true,
  },
  {
    label: <span>Most Clicked &#10147; Geographic Feature</span>,
    id: "-B0St7MawU2Z0npNmVfnsiNLPiv4sA",
  },
  {
    label: <span>Games Started &#10147; Category</span>,
    id: "ikKibFYyXESGkhxAe-Kj7srThTJnGQ",
  },
  {
    label: <span>Games Won &#10147; Category</span>,
    id: "aPB6gfyEnAlcx83QsBlvBQpwIhw2SA",
  },
  {
    label: <span>Games Forefeited &#10147; Category</span>,
    id: "v7xaigS6md5_pgQth-t9BczHRJC0qg",
  },
  {
    label: <span>Games Won &#10147; Country</span>,
    id: "dL_AgjfdWYXRJOYJvgvP5-eLEHWsgA",
  },
  {
    label: <span>Games Forfeited &#10147; Country</span>,
    id: "V1iav5rn8z5SS2BmfA0Aby0gjHTw_A",
  },
  {
    label: <span>Average Clicks Per Win &#10147; Country</span>,
    id: "YQoPd65_tzsP-mC-DLr3BszvMnEhgg",
  },
  {
    label: <span>Average Clicks &#10147; Win</span>,
    id: "idoI9-65Du4mGv7geDcUHneUIgigxQ",
  },
  {
    label: <span>Average Clicks Per Win &#10147; Location of User</span>,
    id: "kz1JhoC7FhxY5uMiZxv8IWZ8ruUQLw",
    worldMap: true,
  },
];

const ChartWrapper: React.FC<ChartProps> = ({ label, id, worldMap }) => {
  const [chartLoaded, setChartLoaded] = useState(false);

  return (
    <div className={worldMap ? "map-chart-wrapper" : ""}>
      <div className="chart-title">{label}</div>
      <div
        className={`chart-container ${worldMap ? "map-chart-container" : ""}`}
      >
        <div
          style={{
            display: `${chartLoaded ? "none" : "flex"}`,
          }}
          className="chart-loading-container"
        >
          <LoadingSpinner />
        </div>
        <iframe
          style={{
            border: "darkgreen 3px solid",
            borderRadius: "10px",
            ...(worldMap && { maxWidth: "950px" }),
          }}
          width="100%"
          height="100%"
          onLoad={() => setChartLoaded(true)}
          src={`https://us.posthog.com/embedded/${id}?noHeader&refresh=true`}
        />
      </div>
    </div>
  );
};

export const GameplayStats: React.FC = () => (
  <div className="stats-page">
    <div className="stats-menu pure-menu pure-menu-horizontal pure-menu-fixed">
      <span className="header-title">MAPSTERY</span>
      <Link className="header-link" to="/">
        Play Game
      </Link>
    </div>
    <div className="chart-grid">
      {gameplayCharts.map(({ label, id, worldMap }) => (
        <ChartWrapper label={label} id={id} worldMap={worldMap} key={id} />
      ))}
    </div>
  </div>
);
