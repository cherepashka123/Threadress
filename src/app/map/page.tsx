// src/app/map/page.tsx
'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Dynamically import FullMap with SSR turned off:
const FullMap = dynamic(() => import('@/components/FullMap'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <main className="relative bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Remove T logo */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-black transition-colors font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Home
            </Link>
            <Link
              href="/threadress"
              className="text-gray-600 hover:text-black transition-colors font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Prototype
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <motion.div
        className="bg-white px-6 py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-4xl md:text-5xl font-light text-black mb-4 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Discover Local Boutiques
        </h1>
        <p
          className="text-xl text-gray-600 max-w-2xl mx-auto font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Create curated shopping routes and discover unique fashion pieces at
          boutiques near you
        </p>
      </motion.div>

      {/* Map Container - Fixed height and proper spacing */}
      <div className="flex-1 px-6 pb-6">
        <div className="h-[calc(100vh-300px)] min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <FullMap />
        </div>
      </div>
    </main>
  );
}
