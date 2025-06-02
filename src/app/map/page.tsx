// src/app/map/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Item, items as rawItems } from '@/data/items';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer and related components so it only loads on client
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

// Leaflet’s default icon imports require a little workaround in Next.js
import L from 'leaflet';
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export default function MapPage() {
  // Track which item’s popup is open
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[40.7128, -74.006]} // New York City center
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap tiles (completely free) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {rawItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            eventHandlers={{
              click: () => setActiveId(item.id),
            }}
          >
            {activeId === item.id && (
              <Popup
                position={[item.latitude, item.longitude]}
                eventHandlers={{
                  remove: () => setActiveId(null),
                }}
                closeButton={false}
                autoClose={false}
                closeOnClick={false}
              >
                <div className="w-64">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setActiveId(null)}
                    aria-label="Close popup"
                  >
                    <FaTimes />
                  </button>
                  <div className="relative w-full h-32 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.storeName}</p>
                  <p className="mt-1 text-indigo-600 font-medium">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
