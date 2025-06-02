// src/app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { Item, items as rawItems } from '@/data/items';
import 'leaflet/dist/leaflet.css';

// Dynamically import react‐leaflet components (client only)
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

// Fix Leaflet icon URLs (only on the client)
if (typeof window !== 'undefined') {
  delete (L.Icon.Default as any).prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  });
}

export default function FullMapPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Only render Leaflet map on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // prevent SSR from attempting to render Leaflet
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Page header */}
      <header className="py-4 bg-white shadow-md">
        <h1 className="text-2xl font-semibold text-center">Boutique Map</h1>
      </header>

      {/* Full‐screen map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={12}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {rawItems.map((item: Item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              eventHandlers={{ click: () => setActiveId(item.id) }}
            >
              {activeId === item.id && (
                <Popup
                  position={[item.latitude, item.longitude]}
                  eventHandlers={{ remove: () => setActiveId(null) }}
                  closeButton={false}
                  autoClose={false}
                  closeOnClick={false}
                >
                  <div className="w-48">
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                      onClick={() => setActiveId(null)}
                      aria-label="Close popup"
                    >
                      <FaTimes />
                    </button>
                    <div className="relative w-full h-24 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-2 text-base font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">{item.storeName}</p>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
