// src/components/FullMap.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import { Item, items as rawItems } from '@/data/items';
import type { LatLngExpression, DivIcon, Map } from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

// Map animation component
function MapController({ activeId }: { activeId: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (activeId !== null && map) {
      const item = rawItems.find((i) => i.id === activeId);
      if (item && item.latitude && item.longitude) {
        map.flyTo([item.latitude, item.longitude], 14, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    }
  }, [activeId, map]);

  return null;
}

// Zoom control component
function ZoomControls() {
  const map = useMap();

  const handleZoomIn = useCallback(() => {
    map.setZoom(map.getZoom() + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map.setZoom(map.getZoom() - 1);
  }, [map]);

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
      <button
        className="w-8 h-8 flex items-center justify-center text-[#8b6f5f] hover:bg-[#8b6f5f] hover:text-white rounded transition-colors duration-200"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className="w-8 h-8 flex items-center justify-center text-[#8b6f5f] hover:bg-[#8b6f5f] hover:text-white rounded transition-colors duration-200"
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        -
      </button>
    </div>
  );
}

type CreateCustomIcon = (isActive: boolean) => DivIcon;

export default function FullMap() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [customIcon, setCustomIcon] = useState<CreateCustomIcon | null>(null);

  // Create custom icon after client-side load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        const createCustomIcon: CreateCustomIcon = (isActive: boolean) =>
          L.divIcon({
            className: 'custom-marker',
            html: `<div class="
              w-10 h-10 
              flex items-center justify-center 
              ${isActive ? 'bg-[#8b6f5f]' : 'bg-white'} 
              rounded-full shadow-lg 
              transform transition-all duration-300 
              ${isActive ? 'scale-110' : 'hover:scale-105'}
              border-2 border-white
            ">
              <div class="${isActive ? 'text-white' : 'text-[#8b6f5f]'} text-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
              </div>
            </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });
        setCustomIcon(() => createCustomIcon);
      });
    }
  }, []);

  // Ensure we're rendering only after client is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle popup close
  const handlePopupClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId(null);
  }, []);

  // Handle link click
  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isClient || !customIcon) return null;

  const center: LatLngExpression = [40.7128, -74.006];

  return (
    <div className="w-full h-screen relative">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController activeId={activeId} />
        <ZoomControls />

        {rawItems.map((item: Item) =>
          item.latitude && item.longitude ? (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={customIcon(activeId === item.id)}
              eventHandlers={{
                click: () => setActiveId(item.id),
              }}
            >
              {activeId === item.id && (
                <Popup
                  position={[item.latitude, item.longitude]}
                  offset={[0, -20]}
                  closeButton={false}
                  className="modern-popup"
                  closeOnClick={false}
                  autoClose={false}
                >
                  <div
                    className="w-64 p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 bg-white rounded-full p-1 shadow-md transition-all duration-200 hover:scale-110 z-50"
                      onClick={handlePopupClose}
                      aria-label="Close popup"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <FaStore className="w-5 h-5 text-[#8b6f5f]" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.storeName}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <p className="text-base font-medium text-gray-800">
                          {item.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaMapMarkerAlt className="w-4 h-4" />
                            <span>0.5 mi away</span>
                          </div>
                          <p className="text-[#8b6f5f] font-medium">
                            ${item.price}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/browse"
                        className="block w-full text-center px-4 py-2 bg-[#8b6f5f] text-white text-sm rounded-lg hover:bg-[#7a6152] transition-colors duration-200"
                        onClick={handleLinkClick}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Location list overlay */}
      <div className="absolute left-4 top-4 bottom-4 w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Nearby Locations
          </h2>
          <p className="text-sm text-gray-600">Discover fashion in your area</p>
        </div>
        <div className="overflow-auto h-[calc(100%-5rem)] p-2">
          {rawItems.map((item) => (
            <div
              key={item.id}
              className={`
                p-3 rounded-xl mb-2 cursor-pointer
                transition-all duration-200
                ${
                  activeId === item.id
                    ? 'bg-[#8b6f5f] text-white'
                    : 'bg-white hover:bg-gray-50'
                }
              `}
              onClick={() => setActiveId(item.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#8b6f5f]/10 flex-shrink-0">
                  <FaStore
                    className={`w-5 h-5 ${activeId === item.id ? 'text-white' : 'text-[#8b6f5f]'}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      activeId === item.id ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      activeId === item.id ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {item.storeName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .custom-marker {
          background: transparent;
          border: none;
        }

        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 1rem;
        }

        .leaflet-popup-content {
          margin: 0;
        }

        .leaflet-popup-tip-container {
          display: none;
        }

        /* Ensure map tiles are visible */
        .leaflet-tile-pane {
          z-index: 1;
        }

        /* Ensure controls are above tiles */
        .leaflet-top,
        .leaflet-bottom {
          z-index: 2;
        }

        /* Make popups more stable */
        .leaflet-popup {
          margin-bottom: 0;
        }

        .leaflet-popup-content {
          margin: 0;
          min-width: 260px;
        }
      `}</style>
    </div>
  );
}
