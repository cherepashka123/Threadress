// src/components/FullMap.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  FaTimes,
  FaMapMarkerAlt,
  FaStore,
  FaRoute,
  FaPlus,
  FaCheck,
  FaClock,
  FaWalking,
  FaCar,
  FaStar,
  FaHeart,
} from 'react-icons/fa';
import { Item, items as rawItems } from '@/data/items';
import type { LatLngExpression, DivIcon, Map, LatLng } from 'leaflet';
import { useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';

// Import Leaflet CSS
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
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  {
    ssr: false,
  }
);

// Map animation component
function MapController({
  activeId,
  routeStops,
}: {
  activeId: number | null;
  routeStops: number[];
}) {
  const map = useMap();

  useEffect(() => {
    if (activeId !== null && map) {
      const item = rawItems.find((i) => i.id === activeId);
      if (item && item.latitude && item.longitude) {
        map.flyTo([item.latitude, item.longitude], 15, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    }
  }, [activeId, map]);

  // Fit map to show all route stops
  useEffect(() => {
    if (routeStops.length > 0 && map) {
      const routeItems = rawItems.filter(
        (item) =>
          routeStops.includes(item.id) && item.latitude && item.longitude
      );
      if (routeItems.length > 0) {
        const bounds = routeItems.map(
          (item) => [item.latitude!, item.longitude!] as [number, number]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routeStops, map]);

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
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2 space-y-2">
      <button
        className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50 rounded transition-colors duration-200"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50 rounded transition-colors duration-200"
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        -
      </button>
    </div>
  );
}

type CreateCustomIcon = (
  isActive: boolean,
  isInRoute: boolean,
  routeIndex?: number
) => DivIcon;

// Connect map items to prototype products
const prototypeProducts = [
  {
    id: 1,
    name: 'Black & Gold Bikini Set',
    imageUrl: '/Products_for_prototype/black_gold_bikini_set.png',
    price: 120,
    style: 'Luxury',
  },
  {
    id: 2,
    name: 'Embellished Mini Dress',
    imageUrl: '/Products_for_prototype/Embellished_mini_dress.png',
    price: 280,
    style: 'Luxury',
  },
  {
    id: 3,
    name: 'Lace Blouse',
    imageUrl: '/Products_for_prototype/lace_blouse.png',
    price: 160,
    style: 'Romantic',
  },
  {
    id: 4,
    name: 'Jean Flowy Shorts',
    imageUrl: '/Products_for_prototype/jean_flowy-shorts.png',
    price: 95,
    style: 'Casual',
  },
  {
    id: 5,
    name: 'White Ballerina Dress',
    imageUrl: '/Products_for_prototype/white_ballerina_dress.png',
    price: 220,
    style: 'Romantic',
  },
  {
    id: 6,
    name: 'Cutout Jeans',
    imageUrl: '/Products_for_prototype/Cutout_jeans.png',
    price: 140,
    style: 'Edgy',
  },
];

// Enhanced items with prototype product connections
const enhancedItems = rawItems.map((item, index) => {
  const prototypeProduct = prototypeProducts[index % prototypeProducts.length];
  return {
    ...item,
    prototypeProduct,
    imageUrl: prototypeProduct.imageUrl,
    actualPrice: prototypeProduct.price,
    style: prototypeProduct.style,
  };
});

// Route optimization function (simple nearest neighbor)
function optimizeRoute(items: any[]): any[] {
  if (items.length <= 1) return items;

  const optimized = [items[0]];
  const remaining = [...items.slice(1)];

  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    remaining.forEach((item, index) => {
      const distance = Math.sqrt(
        Math.pow(current.latitude! - item.latitude!, 2) +
          Math.pow(current.longitude! - item.longitude!, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }

  return optimized;
}

// Calculate route statistics
function calculateRouteStats(routeItems: any[]) {
  if (routeItems.length === 0)
    return { totalDistance: 0, totalTime: 0, totalCost: 0 };

  let totalDistance = 0;
  let totalCost = 0;

  for (let i = 0; i < routeItems.length - 1; i++) {
    const current = routeItems[i];
    const next = routeItems[i + 1];

    const distance =
      Math.sqrt(
        Math.pow(current.latitude! - next.latitude!, 2) +
          Math.pow(current.longitude! - next.longitude!, 2)
      ) * 69; // Rough conversion to miles

    totalDistance += distance;
  }

  routeItems.forEach((item) => {
    totalCost += item.actualPrice;
  });

  const totalTime = totalDistance * 0.3; // Rough estimate: 0.3 hours per mile

  return { totalDistance, totalTime, totalCost };
}

export default function FullMap() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [customIcon, setCustomIcon] = useState<CreateCustomIcon | null>(null);
  const [routeStops, setRouteStops] = useState<number[]>([]);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [routeMode, setRouteMode] = useState<'walking' | 'driving'>('walking');
  const [favorites, setFavorites] = useState<number[]>([]);

  // Create custom icon after client-side load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        import('leaflet')
          .then((L) => {
            const createCustomIcon: CreateCustomIcon = (
              isActive: boolean,
              isInRoute: boolean,
              routeIndex?: number
            ) =>
              L.divIcon({
                className: 'custom-marker',
                html: `<div class="
              w-10 h-10 
              flex items-center justify-center 
                ${isActive ? 'bg-black' : isInRoute ? 'bg-purple-600' : 'bg-white'} 
              rounded-full shadow-lg 
              transform transition-all duration-300 
              ${isActive ? 'scale-110' : 'hover:scale-105'}
                border-2 ${isActive ? 'border-black' : isInRoute ? 'border-purple-600' : 'border-gray-300'}
                relative
            ">
                <div class="${isActive ? 'text-white' : isInRoute ? 'text-white' : 'text-black'} text-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
              </div>
                ${
                  isInRoute && routeIndex !== undefined
                    ? `
                  <div class="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ${routeIndex + 1}
                  </div>
                `
                    : ''
                }
            </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              });
            setCustomIcon(() => createCustomIcon);
            console.log('FullMap: Leaflet loaded successfully');
          })
          .catch((error) => {
            console.error('FullMap: Failed to load Leaflet', error);
            setMapError('Failed to load map library');
          });
      } catch (error) {
        console.error('FullMap: Error in icon creation', error);
        setMapError('Failed to initialize map');
      }
    }
  }, []);

  // Ensure we're rendering only after client is mounted
  useEffect(() => {
    setIsClient(true);
    console.log('FullMap: Client mounted');
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

  // Handle adding to route
  const handleAddToRoute = useCallback((itemId: number) => {
    setRouteStops((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // Handle adding to favorites
  const handleToggleFavorite = useCallback((itemId: number) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // Optimize route
  const optimizedRouteItems =
    routeStops.length > 0
      ? optimizeRoute(
          enhancedItems.filter((item) => routeStops.includes(item.id))
        )
      : [];

  // Generate route coordinates for polyline
  const routeCoordinates = optimizedRouteItems
    .filter((item) => item?.latitude && item?.longitude)
    .map((item) => [item!.latitude!, item!.longitude!] as [number, number]);

  // Calculate route statistics
  const routeStats = calculateRouteStats(optimizedRouteItems);

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FaMapMarkerAlt className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-gray-900 font-medium mb-2">Map Unavailable</p>
          <p className="text-gray-600 text-sm">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isClient || !customIcon) {
    console.log('FullMap: Not ready yet', {
      isClient,
      customIcon: !!customIcon,
    });
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  console.log('FullMap: Rendering map with', {
    itemsCount: enhancedItems.length,
    routeStops,
  });

  const center: LatLngExpression = [40.7128, -74.006];

  return (
    <div className="w-full h-full relative bg-gray-50">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        zoomControl={false}
      >
        {/* Tech-focused map tiles - using CartoDB Positron for a modern, light look */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController activeId={activeId} routeStops={routeStops} />
        <ZoomControls />

        {/* Route polyline with different styles based on mode */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color={routeMode === 'walking' ? '#8b5cf6' : '#3b82f6'}
            weight={4}
            opacity={0.8}
            dashArray={routeMode === 'walking' ? '10, 5' : '20, 10'}
          />
        )}

        {enhancedItems.map((item: any) =>
          item.latitude && item.longitude ? (
            <Marker
              key={`fullmap-marker-${item.id}`}
              position={[item.latitude, item.longitude]}
              icon={customIcon(
                activeId === item.id,
                routeStops.includes(item.id),
                optimizedRouteItems.findIndex(
                  (routeItem) => routeItem.id === item.id
                )
              )}
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
                      className="w-80 p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FaStore className="w-4 h-4 text-black" />
                            <h3
                              className="text-lg font-serif text-black"
                              style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                              {item.storeName}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleFavorite(item.id)}
                              className={`text-sm transition-colors ${
                                favorites.includes(item.id)
                                  ? 'text-red-500'
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <FaHeart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handlePopupClose}
                              className="text-gray-400 hover:text-black transition-colors"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <img
                              src={item.imageUrl}
                              alt={item.prototypeProduct.name}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-base font-serif text-gray-800"
                              style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                              {item.prototypeProduct.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                {item.style}
                              </span>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <FaMapMarkerAlt className="w-3 h-3 text-black" />
                                <span>0.5 mi away</span>
                              </div>
                            </div>
                            <p
                              className="text-black font-serif mt-1"
                              style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                              ${item.actualPrice}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            className={`flex-1 px-3 py-2 rounded-full font-serif text-sm border transition-colors duration-200 ${
                              routeStops.includes(item.id)
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'border-gray-300 text-black hover:bg-gray-50'
                            }`}
                            style={{ fontFamily: 'Playfair Display, serif' }}
                            onClick={() => handleAddToRoute(item.id)}
                          >
                            {routeStops.includes(item.id) ? (
                              <span className="flex items-center justify-center space-x-1">
                                <FaCheck className="w-3 h-3" />
                                <span>In Route</span>
                              </span>
                            ) : (
                              <span className="flex items-center justify-center space-x-1">
                                <FaPlus className="w-3 h-3" />
                                <span>Add to Route</span>
                              </span>
                            )}
                          </button>

                          <Link
                            href={`/threadress?search=${encodeURIComponent(item.prototypeProduct.name)}`}
                          >
                            <button
                              className="flex-1 px-3 py-2 border border-black text-black rounded-full font-serif hover:bg-gray-50 transition-colors duration-200 text-sm"
                              style={{ fontFamily: 'Playfair Display, serif' }}
                              onClick={handleLinkClick}
                            >
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </Popup>
                )}
              </AnimatePresence>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Route Panel */}
      <AnimatePresence>
        {showRoutePanel && routeStops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-4 top-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[1000]"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2
                  className="text-lg font-serif text-black"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Shopping Route
                </h2>
                <button
                  onClick={() => setShowRoutePanel(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* Route Statistics */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Distance</div>
                    <div className="font-semibold text-black">
                      {routeStats.totalDistance.toFixed(1)} mi
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-semibold text-black">
                      {routeStats.totalTime.toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="font-semibold text-black">
                      ${routeStats.totalCost}
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Mode Toggle */}
              <div className="mt-3 flex space-x-2">
                <button
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    routeMode === 'walking'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setRouteMode('walking')}
                >
                  <FaWalking className="inline w-3 h-3 mr-1" />
                  Walking
                </button>
                <button
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    routeMode === 'driving'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setRouteMode('driving')}
                >
                  <FaCar className="inline w-3 h-3 mr-1" />
                  Driving
                </button>
              </div>
            </div>

            <div className="overflow-auto h-full pb-4">
              {optimizedRouteItems.map((item, index) => (
                <motion.div
                  key={`route-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-serif text-black"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {item.prototypeProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.storeName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {item.style}
                        </span>
                        <p
                          className="text-sm text-black font-serif"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          ${item.actualPrice}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToRoute(item.id)}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <Link href={`/threadress?route=${routeStops.join(',')}`}>
                <button
                  className="w-full px-4 py-2 bg-black text-white rounded-full font-serif hover:bg-gray-800 transition-colors duration-200"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Start Shopping Route
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Toggle Button */}
      {routeStops.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute left-4 bottom-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors duration-200 z-[1000]"
          onClick={() => setShowRoutePanel(!showRoutePanel)}
        >
          <FaRoute className="w-5 h-5" />
        </motion.button>
      )}

      {/* Favorites Button */}
      {favorites.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute left-4 bottom-20 bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 transition-colors duration-200 z-[1000]"
        >
          <FaHeart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            {favorites.length}
          </span>
        </motion.button>
      )}

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
          border-radius: 0.5rem;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
          z-index: 900;
        }

        /* Make popups more stable */
        .leaflet-popup {
          margin-bottom: 0;
          z-index: 950;
        }

        .leaflet-popup-content {
          margin: 0;
          min-width: 320px;
        }
      `}</style>
    </div>
  );
}
