import React, {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { getMapOptions, initialMapProps } from "../utils";
import { GameStatus, Country, GameCategory } from "../types";

interface GameplayMapProps extends google.maps.MapOptions {
  gameStatus: GameStatus;
  gameCategory?: GameCategory;
  targetCountryData?: Country;
  distanceFromTarget?: number;
  latestClickCoordinates?: google.maps.LatLng;
  style: { [key: string]: string };
  onClick: (e: google.maps.MapMouseEvent) => void;
  children?: React.ReactNode;
}

export const GameplayMap: React.FC<GameplayMapProps> = ({
  gameStatus,
  gameCategory,
  targetCountryData,
  distanceFromTarget,
  latestClickCoordinates,
  onClick,
  children,
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          mapId: "mapstery",
          ...initialMapProps,
        })
      );
    }
  }, [ref, map, props.zoom, props.center]);

  useEffect(() => {
    if (!!map) {
      ["click"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }
    }
  }, [map, onClick]);

  useEffect(() => {
    if (!!map && !!targetCountryData)
      map.setOptions(
        getMapOptions(gameStatus, gameCategory, targetCountryData)
      );
  }, [map, targetCountryData, gameStatus]);

  useEffect(() => {
    if (!!map && !!distanceFromTarget && !!latestClickCoordinates) {
      const initialRadius = 0;

      const clickDistanceIndicator = new google.maps.Circle({
        center: latestClickCoordinates,
        radius: initialRadius, // meters
        map: map,
        strokeColor: "yellow",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "yellow",
        fillOpacity: 0.1,
      });

      let currentRadius = initialRadius;
      const maxRadius = distanceFromTarget * 1000; // meters

      const growthRate = 22000 / (map.getZoom() || 1); // Amount to increase the radius per interval (in meters)
      const intervalRate = 5;

      const timeRequiredToFillCircle = (maxRadius / growthRate) * intervalRate;

      const intervalId = setInterval(() => {
        if (currentRadius < maxRadius) {
          currentRadius += growthRate;
          clickDistanceIndicator.setRadius(currentRadius);
        } else {
          clearInterval(intervalId); // Stop expanding when max radius is reached
        }
      }, intervalRate); // Adjust interval duration for speed (in milliseconds)

      setTimeout(() => {
        clickDistanceIndicator.setMap(null);
      }, 500 + timeRequiredToFillCircle); // delete the circle shortly after expanding to the full radius
    }
  }, [map, distanceFromTarget, latestClickCoordinates]);

  return (
    <>
      <div ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};
