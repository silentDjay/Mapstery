import React, {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getMapOptions,
  initialMapProps,
  generateCirclePoints,
  dottedLineSegment,
} from "../utils";
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
    if (
      !!map &&
      !!distanceFromTarget &&
      !!latestClickCoordinates &&
      gameStatus === "INIT"
    ) {
      const initialRadius = 0;

      // Create the circle approximation with a polyline
      const circlePolyline = new google.maps.Polyline({
        path: generateCirclePoints(latestClickCoordinates, initialRadius),
        map: map,
        strokeColor: "yellow",
        strokeOpacity: 0, // Invisible stroke, only show dots
        icons: [dottedLineSegment(1)],
      });

      const maxRadius = distanceFromTarget * 1000; // meters

      const growthRate = 22000 / (map.getZoom() || 1); // Amount to increase the radius per interval (in meters)
      const expandCircleIntervalRate = 5;

      let currentRadius = initialRadius;
      // animate an expanding circle from the clicked point
      const expandCircleInterval = setInterval(() => {
        if (currentRadius < maxRadius) {
          currentRadius += growthRate;
          circlePolyline.setOptions({
            path: generateCirclePoints(latestClickCoordinates, currentRadius),
          });
        } else {
          clearInterval(expandCircleInterval); // Stop expanding when max radius is reached
        }
      }, expandCircleIntervalRate);

      const timeRequiredToFillCircle =
        (maxRadius / growthRate) * expandCircleIntervalRate;

      // animate a blinking line when the full radius is reached
      setTimeout(() => {
        let isVisible = true;
        setInterval(() => {
          isVisible = !isVisible;
          circlePolyline.setOptions({
            icons: [dottedLineSegment(isVisible ? 1 : 0)],
          });
        }, 250); // blinking speed
      }, timeRequiredToFillCircle);

      // remove the circle
      setTimeout(() => {
        circlePolyline.setMap(null);
      }, 2000 + timeRequiredToFillCircle);
    }
  }, [map, distanceFromTarget, latestClickCoordinates, gameStatus]);

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
