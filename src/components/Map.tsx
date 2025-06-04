'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { SearchItem } from '@/components/VectorSearchDemo';
import { FaStore, FaMapMarkerAlt } from 'react-icons/fa';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Create custom marker icons for different states
const createMarkerIcon = (isActive: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="
      w-8 h-8 
      flex items-center justify-center 
      ${isActive ? 'bg-[#8b6f5f]' : 'bg-white'} 
      rounded-full shadow-lg 
      transform transition-all duration-300 
      ${isActive ? 'scale-110' : 'hover:scale-105'}
      border-2 border-white
    ">
      <div class="${isActive ? 'text-white' : 'text-[#8b6f5f]'} text-sm">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      </div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export interface MapProps {
  stores: SearchItem[];
  activeResults: SearchItem[];
  activeStore: number | null;
  onStoreClick: (id: number) => void;
}

const Map = ({
  stores,
  activeResults,
  activeStore,
  onStoreClick,
}: MapProps) => {
  // Calculate the center of all store locations
  const center = stores.reduce(
    (acc, store) => {
      acc.lat += store.store.lat / stores.length;
      acc.lng += store.store.lng / stores.length;
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  // Filter stores to show only when there are search results or an active store
  const visibleStores = stores;
  const activeStores =
    activeResults.length > 0
      ? activeResults
      : activeStore !== null
        ? [stores.find((store) => store.id === activeStore)!]
        : [];

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {visibleStores.map((item) => {
        const isActive =
          activeStore === item.id ||
          activeResults.some((result) => result.id === item.id);
        return (
          <Marker
            key={item.id}
            position={[item.store.lat, item.store.lng]}
            icon={createMarkerIcon(isActive)}
            eventHandlers={{
              click: () => onStoreClick(item.id),
            }}
          >
            <Popup>
              <div className="w-48 p-3 bg-white rounded-lg shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FaStore className="w-4 h-4 text-[#8b6f5f]" />
                  <span className="text-sm font-medium text-gray-900">
                    {item.store.name}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.text}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-600">
                      <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                      <span>0.5 mi away</span>
                    </div>
                    <span className="text-[#8b6f5f] font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      {!visibleStores.length && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center text-gray-600 shadow-sm">
          Search for items to see store locations on the map
        </div>
      )}
    </MapContainer>
  );
};

export default Map;

<style jsx global>{`
  .custom-marker {
    background: transparent;
    border: none;
  }

  .leaflet-popup-content-wrapper {
    padding: 0;
    overflow: hidden;
    border-radius: 0.75rem;
  }

  .leaflet-popup-content {
    margin: 0;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-container {
    font-family: var(--font-primary);
  }
`}</style>;
