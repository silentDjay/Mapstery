import React from "react";

interface LoadingSpinnerProps {
  color?: "black" | "white";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = "white",
}) => (
  <div className={`loading-spinner${color === "black" ? " black" : ""}`}>
    <div style={{ margin: "0 0 6px 4px" }}>&#10147;</div>
  </div>
);
