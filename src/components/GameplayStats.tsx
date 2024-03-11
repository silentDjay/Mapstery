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
    label: <span>Most Frequently Found &#10147; Country</span>,
    id: "dL_AgjfdWYXRJOYJvgvP5-eLEHWsgA",
  },
  {
    label: <span>Games Won &#10147; Category</span>,
    id: "aPB6gfyEnAlcx83QsBlvBQpwIhw2SA",
  },
  {
    label: <span>Games Won &#10147; Number of Clicks</span>,
    id: "idoI9-65Du4mGv7geDcUHneUIgigxQ",
  },
  {
    label: <span>Games Forfeited &#10147; Country</span>,
    id: "V1iav5rn8z5SS2BmfA0Aby0gjHTw_A",
  },
  {
    label: <span>Most Clicked &#10147; Geographic Feature</span>,
    id: "-B0St7MawU2Z0npNmVfnsiNLPiv4sA",
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
      <span className="header-title">
        MAPSTERY <span className="arrowhead">&#10147;</span>{" "}
        <span className="addendum">Last 30 Days</span>
      </span>
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
