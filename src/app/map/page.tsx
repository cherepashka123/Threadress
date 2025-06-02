// src/app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically load MapPreview only on the client
const MapPreview = dynamic(() => import('@/components/MapPreview'), {
  ssr: false,
});

export default function FullMapPage() {
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <header className="py-4 bg-white shadow-md">
        <h1 className="text-2xl font-semibold text-center">Boutique Map</h1>
      </header>

      {/* Full-screen client-only map */}
      <div className="flex-1">
        <MapPreview />
      </div>
    </div>
  );
}
