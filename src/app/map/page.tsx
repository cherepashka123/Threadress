// src/app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import FullMap with SSR turned off:
const FullMap = dynamic(() => import('@/components/FullMap'), {
  ssr: false,
});

export default function MapPage() {
  return (
    // We only render the FullMap component; no server‐side Leaflet logic
    <FullMap />
  );
}
