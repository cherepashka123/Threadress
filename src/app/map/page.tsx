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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          {/* Remove T logo */}
          <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8 w-full sm:w-auto">
            <Link
              href="/"
              className="text-gray-600 hover:text-black transition-colors font-serif text-base sm:text-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Home
            </Link>
            <Link
              href="/threadress"
              className="text-gray-600 hover:text-black transition-colors font-serif text-base sm:text-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Prototype
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <motion.div
        className="bg-white px-4 sm:px-6 py-8 sm:py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-light text-black mb-3 sm:mb-4 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Discover Local Boutiques
        </h1>
        <p
          className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Create curated shopping routes and discover unique fashion pieces at
          boutiques near you
        </p>
      </motion.div>

      {/* Map Container - Fixed height and proper spacing */}
      <div className="flex-1 px-2 sm:px-6 pb-6">
        <div className="h-[60vh] sm:h-[calc(100vh-300px)] min-h-[300px] sm:min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm w-full">
          <FullMap />
        </div>
      </div>
    </main>
  );
}
