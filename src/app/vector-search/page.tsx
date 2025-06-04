'use client';

import VectorSearchDemo from '@/components/VectorSearchDemo';
import { motion } from 'framer-motion';

export default function VectorSearchPage() {
  return (
    <main className="relative bg-[#fafafa] min-h-screen">
      {/* Tech-inspired background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            Smart Fashion Discovery
          </h1>
          <p className="text-neutral-600 font-light max-w-xl mx-auto">
            Find your perfect style across our network of boutiques using
            AI-powered search
          </p>
        </motion.div>

        <VectorSearchDemo />

        {/* How It Works section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-light tracking-[-0.02em] text-neutral-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white border border-neutral-100"
            >
              <h3 className="text-lg font-light text-neutral-900 mb-3">
                Style Understanding
              </h3>
              <p className="text-neutral-600 font-light">
                Our AI analyzes your search to understand style, cut, fabric,
                and occasion preferences.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white border border-neutral-100"
            >
              <h3 className="text-lg font-light text-neutral-900 mb-3">
                Smart Matching
              </h3>
              <p className="text-neutral-600 font-light">
                We find similar items by comparing style features across our
                partner stores' inventory.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white border border-neutral-100"
            >
              <h3 className="text-lg font-light text-neutral-900 mb-3">
                Local Availability
              </h3>
              <p className="text-neutral-600 font-light">
                See real-time availability and locations of matching items in
                stores near you.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
