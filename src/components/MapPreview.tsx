'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import { Item, items as rawItems } from '@/data/items';
import type { LatLngExpression, DivIcon } from 'leaflet';
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

type CreateCustomIcon = (isActive: boolean) => DivIcon;

export default function MapPreview() {
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
              w-8 h-8 
              flex items-center justify-center 
              ${isActive ? 'bg-[#8b6f5f]' : 'bg-white'} 
              rounded-full shadow-lg 
              transform transition-all duration-300 
              ${isActive ? 'scale-110' : 'hover:scale-105'}
              border-2 border-white
              group
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
        setCustomIcon(() => createCustomIcon);
      });
    }
  }, []);

  // Ensure we're rendering only after client is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !customIcon) return null;

  const center: LatLngExpression = [40.7128, -74.006];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-60 -z-10" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full blur-2xl opacity-60 -z-10" />

      {/* Map container with glass effect */}
      <div className="backdrop-blur-sm bg-white/80 p-2 rounded-2xl shadow-lg">
        <div className="h-48 rounded-xl overflow-hidden relative">
          <MapContainer
            center={center}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

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
                      offset={[0, -16]}
                      closeButton={false}
                      className="preview-popup"
                    >
                      <div className="w-48 p-3 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaStore className="w-4 h-4 text-[#8b6f5f]" />
                          <span className="text-sm font-medium text-gray-900">
                            {item.storeName}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <div className="flex items-center text-xs text-gray-600">
                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                            <span>0.5 mi away</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  )}
                </Marker>
              ) : null
            )}
          </MapContainer>

          {/* Overlay text */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm">
              {rawItems.length} boutiques nearby
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-[#8b6f5f] shadow-sm">
              Click to explore
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }

        .preview-popup .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 0.75rem;
        }

        .preview-popup .leaflet-popup-content {
          margin: 0;
        }

        .preview-popup .leaflet-popup-tip-container {
          display: none;
        }

        .leaflet-container {
          font-family: var(--font-primary);
        }
      `}</style>
    </div>
  );
}
