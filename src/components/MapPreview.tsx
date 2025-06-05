'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import { Item, items as rawItems } from '@/data/items';
import type { LatLngExpression, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

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
              ${isActive ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-white'} 
              rounded-full shadow-lg 
              transform transition-all duration-300 
              ${isActive ? 'scale-110' : 'hover:scale-105'}
              border-2 border-white
              group
            ">
              <div class="${isActive ? 'text-white' : 'text-indigo-600'} text-sm">
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
      {/* Discovery Insights Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute -left-64 top-0 bottom-0 w-56 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-sm font-medium text-gray-900">
              Live Updates
            </span>
          </div>

          {/* Trending Categories */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2">Trending Categories</h4>
            <div className="space-y-2">
              {[
                { name: 'Summer Dresses', count: 12 },
                { name: 'Sustainable Fashion', count: 8 },
                { name: 'Local Designers', count: 5 },
              ].map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-700">{category.name}</span>
                  <motion.div
                    className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '4rem' }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(category.count / 12) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {[
                { text: 'New collection at ModernFit', time: '2m ago' },
                { text: 'Flash sale at Style Studio', time: '5m ago' },
                { text: 'Restock at Elegance', time: '8m ago' },
              ].map((activity, index) => (
                <motion.div
                  key={activity.text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-1 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                    <span className="text-gray-700">{activity.text}</span>
                  </div>
                  <span className="text-indigo-600 text-[10px] ml-2.5">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Discovery Stats */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2">Discovery Stats</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Boutiques', value: '25+' },
                { label: 'New Items', value: '150+' },
                { label: 'Local Brands', value: '12' },
                { label: 'Events', value: '5' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/50 rounded-lg p-2 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Map Container */}
      <div className="backdrop-blur-sm bg-white/80 p-2 rounded-2xl shadow-lg">
        {/* Discovery Pulse Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(99, 102, 241, 0)',
              '0 0 0 10px rgba(99, 102, 241, 0.1)',
              '0 0 0 20px rgba(99, 102, 241, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Tech Grid Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-[0.03]"
          initial={false}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

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
                  key={`preview-marker-${item.id}`}
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
                          <FaStore className="w-4 h-4 text-indigo-600" />
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

          {/* Live Trends Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-3 right-3"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-2 border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span className="text-xs font-medium text-gray-700">
                  Live Trends
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    text: '3 new arrivals at Elegance Boutique',
                    time: '2m ago',
                  },
                  {
                    text: 'Summer collection trending at ModernFit',
                    time: '5m ago',
                  },
                  {
                    text: 'Flash sale starting at Style Studio',
                    time: '8m ago',
                  },
                ].map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="w-1 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                      <span className="text-gray-700 truncate">
                        {update.text}
                      </span>
                    </div>
                    <span className="text-indigo-600 font-medium ml-2">
                      {update.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Overlay text with enhanced styling */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <motion.div
              className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span>{rawItems.length} boutiques nearby</span>
            </motion.div>
            <motion.div
              className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-indigo-600 shadow-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span>Click to explore</span>
              <motion.div
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                →
              </motion.div>
            </motion.div>
          </div>

          {/* Discovery Radius Visualization */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={false}
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 30%, transparent 70%)',
                'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Distance Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute inset-0 pointer-events-none"
              initial={false}
              animate={{
                scale: [1, 1.2],
                opacity: [0.1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
              style={{
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Discovery Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Discover Your Fashion Neighborhood
            </h3>
            <motion.div
              className="text-xs text-indigo-600 flex items-center gap-1"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Explore More
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.div>
          </div>

          {/* Discovery Features Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                label: 'Real-time Location',
                value: '0.5mi away',
              },
              {
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                label: 'Opening Hours',
                value: 'Open Now',
              },
              {
                icon: (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-4-7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
                label: 'Style Match',
                value: '92% Match',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 rounded-xl p-3 hover:bg-white/80 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-indigo-600 group-hover:text-indigo-700 transition-colors">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {feature.label}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {feature.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trending Items Preview */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs text-gray-500">Trending Items Nearby</h4>
              <span className="text-[10px] text-indigo-600">View All</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {[
                { name: 'Summer Dress', price: '$125', trend: '+12%' },
                { name: 'Linen Blazer', price: '$189', trend: '+8%' },
                { name: 'Silk Scarf', price: '$75', trend: '+5%' },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-none w-32 bg-white rounded-lg p-2 border border-neutral-100"
                >
                  <div className="w-full h-20 bg-neutral-50 rounded-md mb-2" />
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{item.price}</span>
                    <span className="text-[10px] text-green-600">
                      {item.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white"
              >
                Get Directions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-gray-600"
              >
                Save for Later
              </motion.button>
            </div>
            <motion.div
              className="text-xs text-gray-500 flex items-center gap-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1 h-1 rounded-full bg-green-500" />
              Live Preview
            </motion.div>
          </div>
        </div>
      </motion.div>

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
