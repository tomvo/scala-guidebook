import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export default function GoogleMapField({ input }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [marker, setMarker] = useState({
    lat: input.value.lat || 0,
    lng: input.value.lng || 0,
    zoom: input.value.zoom || 2,
  });

  const onMapClick = useCallback((e) => {
    const newVal = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      zoom: marker.zoom,
    };
    setMarker(newVal);
    input.onChange(newVal);
  }, [input, marker.zoom]);

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded)  return <p>Loading map…</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '200px' }}
        center={{ lat: marker.lat, lng: marker.lng }}
        zoom={marker.zoom}
        onClick={onMapClick}
      >
        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
      </GoogleMap>
      <p>
        Lat: <code>{marker.lat.toFixed(4)}</code>, 
        Lng: <code>{marker.lng.toFixed(4)}</code>
      </p>
    </>
  );
}