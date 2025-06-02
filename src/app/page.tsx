// src/app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically load MapPreview only on the client
const MapPreview = dynamic(() => import('@/components/MapPreview'), {
  ssr: false,
});

export default function FullMapPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-6">Boutique Map</h1>
      <div className="max-w-4xl mx-auto">
        <MapPreview />
      </div>
    </div>
  );
}
