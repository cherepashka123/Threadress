'use client';

import VectorSearchDemo from '@/components/VectorSearchDemo';
import { motion } from 'framer-motion';

export default function SmartSearchPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] py-24">
      <div className="max-w-7xl mx-auto px-6">
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
      </div>
    </main>
  );
}
