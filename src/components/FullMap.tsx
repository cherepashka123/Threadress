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
import BoutiqueFeatures from './BoutiqueFeatures';
import BoutiqueInsights from './BoutiqueInsights';
import BoutiqueDetails from './BoutiqueDetails';
import { motion, AnimatePresence } from 'framer-motion';

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
        className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-gradient-to-r hover:from-violet-600 hover:to-indigo-600 hover:text-white rounded transition-all duration-200"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-gradient-to-r hover:from-violet-600 hover:to-indigo-600 hover:text-white rounded transition-all duration-200"
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
  const [showFeatures, setShowFeatures] = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

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
              ${isActive ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-white'} 
              rounded-full shadow-lg 
              transform transition-all duration-300 
              ${isActive ? 'scale-110' : 'hover:scale-105'}
              border-2 border-white
            ">
              <div class="${isActive ? 'text-white' : 'text-indigo-600'} text-lg">
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
              key={`fullmap-marker-${item.id}`}
              position={[item.latitude, item.longitude]}
              icon={customIcon(activeId === item.id)}
              eventHandlers={{
                click: () => setActiveId(item.id),
              }}
            >
              <AnimatePresence mode="wait">
                {activeId === item.id && (
                  <Popup
                    key={`fullmap-popup-${item.id}`}
                    position={[item.latitude, item.longitude]}
                    offset={[0, -16]}
                    closeButton={false}
                    className="custom-popup"
                  >
                    <motion.div
                      key={`fullmap-popup-content-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-64 p-4 bg-white rounded-lg"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FaStore className="w-5 h-5 text-indigo-600" />
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
                              <FaMapMarkerAlt className="w-4 h-4 text-indigo-600" />
                              <span>0.5 mi away</span>
                            </div>
                            <p className="text-indigo-600 font-medium">
                              ${item.price}
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/browse"
                          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm rounded-lg hover:opacity-90 transition-all duration-200 relative overflow-hidden group"
                          onClick={handleLinkClick}
                        >
                          <motion.div
                            key={`fullmap-link-gradient-${item.id}`}
                            className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-indigo-400/30 bg-[length:200%_100%]"
                            animate={{
                              backgroundPosition: ['200% 0', '-200% 0'],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                          <span className="relative z-10 text-white/95 font-medium">
                            View Details
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  </Popup>
                )}
              </AnimatePresence>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* All panels */}
      <AnimatePresence mode="wait">
        {showDetails && (
          <motion.div
            key="boutique-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="z-[1000]"
          >
            <BoutiqueDetails />
          </motion.div>
        )}
        {showFeatures && (
          <motion.div
            key="boutique-features"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="z-[1000]"
          >
            <BoutiqueFeatures />
          </motion.div>
        )}
        {showInsights && (
          <motion.div
            key="boutique-insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="z-[1000]"
          >
            <BoutiqueInsights />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .custom-marker {
          background: transparent;
          border: none;
          z-index: 900;
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

        /* Ensure controls are above tiles but below panels */
        .leaflet-top,
        .leaflet-bottom {
          z-index: 900;
        }

        /* Make popups more stable */
        .leaflet-popup {
          margin-bottom: 0;
          z-index: 950;
        }

        .leaflet-popup-content {
          margin: 0;
          min-width: 260px;
        }
      `}</style>
    </div>
  );
}
