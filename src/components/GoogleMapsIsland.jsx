import React from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

export default function GoogleMapIsland({
  latitude,
  longitude,
  zoom = 12,
  height = '400px',
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  console.log('Google Maps API Key:', import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY);

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded)  return <p>Loading map…</p>;

  const center = { lat: latitude, lng: longitude };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height }}
      center={center}
      zoom={zoom}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}