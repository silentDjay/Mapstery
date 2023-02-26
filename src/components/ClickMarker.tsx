import React from "react";

export const ClickMarker: React.FC<
  google.maps.marker.AdvancedMarkerViewOptions
> = (markerProps) => {
  const [marker, setMarker] =
    React.useState<google.maps.marker.AdvancedMarkerViewOptions>();

  React.useEffect(() => {
    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.map = null;
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.marker.AdvancedMarkerView(markerProps));
    }
  }, [marker, markerProps]);

  return null;
};
