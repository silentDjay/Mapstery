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
  getInitialMapPropsByGameCategory,
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
    if (!map) return;

    if (!!targetCountryData)
      map.setOptions(
        getMapOptions(gameStatus, gameCategory, targetCountryData)
      );

    if (gameStatus === "INIT") {
      const zoomLevel = map?.getZoom();

      // INFO: make the animation faster when more zoomed out
      const calibratedAnimationInterval =
        !!zoomLevel && zoomLevel > 2 ? 25 : 15;

      const initialCenterCoordinates =
        getInitialMapPropsByGameCategory(gameCategory).center;

      const initialCenterLatitude = initialCenterCoordinates.lat;
      const initialCenterLongitude = initialCenterCoordinates.lng;

      const initialLatLngAnimationPolylineProps = {
        path: [initialCenterCoordinates, initialCenterCoordinates],
        map: map,
        strokeOpacity: 0.0001, // the icon doesn't show up if this is 0 :shrug:
        icons: [
          {
            icon: {
              path: "M15.0,95.0 L55.0,-45.0 L95.0,95.0 L55.0,55.0 Z", // arrowhead character (&#10147;) SVG path approximation)
              fillColor: "white",
              fillOpacity: 100,
              scale: 0.25,
            },
          },
        ],
      };

      const northwardLine = new google.maps.Polyline(
        initialLatLngAnimationPolylineProps
      );

      const eastwardLine = new google.maps.Polyline(
        initialLatLngAnimationPolylineProps
      );

      const southwardLine = new google.maps.Polyline(
        initialLatLngAnimationPolylineProps
      );

      const westwardLine = new google.maps.Polyline(
        initialLatLngAnimationPolylineProps
      );

      let dueNorthLatitude = initialCenterLatitude;
      let dueEastLongitude = initialCenterLongitude;
      let dueSouthLatitude = initialCenterLatitude;
      let dueWestLongitude = initialCenterLongitude;

      const mapBoundaries = map.getBounds();

      const northBoundary = mapBoundaries?.getNorthEast().lat() || 90;
      const southBoundary = mapBoundaries?.getSouthWest().lat() || -90;

      const dueNorthAnimation = setInterval(() => {
        if (dueNorthLatitude < northBoundary) {
          dueNorthLatitude += 0.5;

          northwardLine.setPath([
            initialCenterCoordinates,
            { lat: dueNorthLatitude, lng: initialCenterLongitude },
          ]);
        } else {
          clearInterval(dueNorthAnimation);
          northwardLine.setMap(null);
        }
      }, calibratedAnimationInterval);

      const dueSouthAnimation = setInterval(() => {
        if (dueSouthLatitude > southBoundary) {
          dueSouthLatitude -= 0.5;

          southwardLine.setPath([
            initialCenterCoordinates,
            { lat: dueSouthLatitude, lng: initialCenterLongitude },
          ]);
        } else {
          clearInterval(dueSouthAnimation);
          southwardLine.setMap(null);
        }
      }, calibratedAnimationInterval);

      const eastWestAnimation = setInterval(() => {
        dueEastLongitude += 1;
        eastwardLine.setPath([
          { lat: initialCenterLatitude, lng: dueEastLongitude - 1 },
          { lat: initialCenterLatitude, lng: dueEastLongitude },
        ]);

        dueWestLongitude -= 1;
        westwardLine.setPath([
          { lat: initialCenterLatitude, lng: dueWestLongitude + 1 },
          { lat: initialCenterLatitude, lng: dueWestLongitude },
        ]);
      }, calibratedAnimationInterval);

      setTimeout(
        () => {
          clearInterval(eastWestAnimation);
          westwardLine.setMap(null);
          eastwardLine.setMap(null);
        },
        !!zoomLevel && zoomLevel > 2 ? 3000 : 4000
      );
    }
  }, [map, targetCountryData, gameStatus, gameCategory]);

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
