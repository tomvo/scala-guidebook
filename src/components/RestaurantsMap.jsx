import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function RestaurantsMap({ places = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current || !mapContainer.current || places.length === 0) return;

    const mapOptions = {
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    };

    if (places.length === 1) {
      mapOptions.center = [places[0].lng, places[0].lat];
      mapOptions.zoom = 11;
    } else {
      const lngs = places.map(p => p.lng);
      const lats = places.map(p => p.lat);
      mapOptions.bounds = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];
      mapOptions.fitBoundsOptions = { padding: 40, maxZoom: 13 };
    }

    map.current = new maplibregl.Map(mapOptions);
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    places.forEach(p => {
      const el = document.createElement('div');
      el.style.cssText = `
        width: 14px; height: 14px; border-radius: 50%;
        background: #e74c3c; border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      const popup = new maplibregl.Popup({ offset: 14, closeButton: false })
        .setHTML(`<div style="font-size:13px;font-weight:600;padding:2px 4px">${p.name}</div>`);
      new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  if (places.length === 0) return null;

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        margin: '16px 0',
      }}
    />
  );
}
