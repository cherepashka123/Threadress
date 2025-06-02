// src/components/FullMap.tsx
'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { Item, items as rawItems } from '@/data/items';
import 'leaflet/dist/leaflet.css';

// ─── Fix Leaflet’s default icon URLs (Next.js needs this) ────────────────────
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export default function FullMap() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[40.7128, -74.006]} // NYC center
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {rawItems.map((item: Item) => (
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
                  <h3 className="mt-2 text-base font-semibold">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.storeName}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
