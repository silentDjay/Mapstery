import React, { useEffect, useState } from "react";

export const ClickMarker: React.FC<
  google.maps.marker.AdvancedMarkerViewOptions
> = (markerProps) => {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerViewOptions>();

  useEffect(() => {
    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.map = null;
      }
    };
  }, [marker]);

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.marker.AdvancedMarkerView(markerProps));
    }
  }, [marker, markerProps]);

  return null;
};
