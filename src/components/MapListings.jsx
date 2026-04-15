import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_COLORS = {
  food: '#e74c3c',
  drinks: '#8e44ad',
  beaches: '#3b82f6',
  nature: '#22c55e',
  activities: '#f59e0b',
  villages: '#8b5cf6',
};

function RestaurantCard({ restaurant, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '10px 12px',
        background: isActive ? '#f0f7ff' : '#fff',
        border: isActive ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '6px',
        cursor: restaurant.lat ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
          {restaurant.name}
        </span>
        {restaurant.price && (
          <span style={{
            flexShrink: 0,
            background: '#f3f4f6',
            borderRadius: '999px',
            padding: '1px 6px',
            fontSize: '11px',
            color: '#6b7280',
            lineHeight: '18px',
          }}>
            {restaurant.price}
          </span>
        )}
      </div>
      {restaurant.address && (
        <div style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.3 }}>
          {restaurant.address}
        </div>
      )}
      {restaurant.description && (
        <div style={{ margin: '4px 0 0', fontSize: '12px', color: '#374151', lineHeight: 1.4 }}>
          {restaurant.description}
        </div>
      )}
      {restaurant.notes && (
        <div style={{ margin: '3px 0 0', fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
          {restaurant.notes}
        </div>
      )}
    </div>
  );
}

export default function MapListings({ restaurants = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const popups = useRef([]);
  const [activeId, setActiveId] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  const cardRefs = useRef({});

  const restaurantsWithCoords = restaurants.filter(r => r.lat && r.lng);

  const getBounds = useCallback((items) => {
    if (items.length === 0) return null;
    const lngs = items.map(r => r.lng);
    const lats = items.map(r => r.lat);
    return [
      [Math.min(...lngs) - 0.05, Math.min(...lats) - 0.03],
      [Math.max(...lngs) + 0.05, Math.max(...lats) + 0.03],
    ];
  }, []);


  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const bounds = getBounds(restaurantsWithCoords);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      bounds: bounds || [[12.5, 43.0], [14.0, 43.8]],
      fitBoundsOptions: { padding: 40 },
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markers.current.forEach(m => m.remove());
    popups.current.forEach(p => p.remove());
    markers.current = [];
    popups.current = [];

    const filtered = filter === 'all'
      ? restaurantsWithCoords
      : restaurantsWithCoords.filter(r => r.category === filter);

    filtered.forEach((r) => {
      const color = DEFAULT_COLORS[r.category] || '#e74c3c';

      const el = document.createElement('div');
      el.style.cssText = `
        width: 12px; height: 12px; border-radius: 50%;
        background: ${color}; border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        cursor: pointer; transition: transform 0.15s;
      `;

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false })
        .setHTML(`<div style="font-size:13px;font-weight:600;padding:2px 4px">${r.name}</div>`);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([r.lng, r.lat])
        .setPopup(popup)
        .addTo(map.current);

      el.addEventListener('click', () => {
        setActiveId(r.id);
        const cardEl = cardRefs.current[r.id];
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      markers.current.push(marker);
      popups.current.push(popup);
    });

    if (filtered.length > 0) {
      const bounds = getBounds(filtered);
      if (bounds) {
        map.current.fitBounds(bounds, { padding: 40, duration: 500 });
      }
    }
  }, [filter, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const filtered = filter === 'all'
      ? restaurantsWithCoords
      : restaurantsWithCoords.filter(r => r.category === filter);

    filtered.forEach((r, i) => {
      const marker = markers.current[i];
      if (!marker) return;
      const el = marker.getElement();

      if (r.id === activeId) {
        el.style.transform = 'scale(1.8)';
        el.style.zIndex = '10';
        marker.getPopup().addTo(map.current);
      } else {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
        marker.getPopup().remove();
      }
    });
  }, [activeId, filter, mapLoaded]);

  const handleCardClick = useCallback((restaurant) => {
    if (!restaurant.lat || !restaurant.lng) return;

    setActiveId(restaurant.id);

    if (map.current) {
      map.current.flyTo({
        center: [restaurant.lng, restaurant.lat],
        zoom: 14,
        duration: 800,
      });
    }
  }, []);

  const filteredRestaurants = filter === 'all'
    ? restaurants
    : restaurants.filter(r => r.category === filter);

  // Derive categories dynamically from the data
  const categories = [...new Set(restaurants.map(r => r.category))];
  const categoryLabels = categories.map(cat => ({
    key: cat,
    label: `${cat.charAt(0).toUpperCase() + cat.slice(1)} (${restaurants.filter(r => r.category === cat).length})`,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
      {/* Map */}
      <div
        ref={mapContainer}
        className="map-listings-map"
      />

      {/* Filter bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '8px 0',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
      }}>
        {[
          { key: 'all', label: `All (${restaurants.length})` },
          ...categoryLabels,
        ].map(({ key, label }) => (
          <span
            key={key}
            onClick={() => { setFilter(key); setActiveId(null); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && (setFilter(key), setActiveId(null))}
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              background: filter === key ? '#1a1a1a' : '#f3f4f6',
              color: filter === key ? '#fff' : '#374151',
              transition: 'all 0.15s',
              userSelect: 'none',
              lineHeight: '16px',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Cards grouped by category */}
      <div style={{ padding: '8px 0' }}>
        {categories.map(cat => {
          const items = filteredRestaurants.filter(r => r.category === cat);
          if (items.length === 0) return null;
          return items.map((r) => (
            <div key={r.id} ref={el => { cardRefs.current[r.id] = el; }}>
              <RestaurantCard
                restaurant={r}
                isActive={r.id === activeId}
                onClick={() => handleCardClick(r)}
              />
            </div>
          ));
        })}
      </div>
    </div>
  );
}
