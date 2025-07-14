'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';
import Hero from '@/components/Hero';
import Search from '@/components/Search';
import SignupForm from '@/components/SignupForm';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Prototype from '@/components/Prototype';
import Mission from '@/components/Mission';
import Statistics from '@/components/Statistics';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

// Dynamically load MapPreview on client only
const MapPreviewComponent = dynamic(() => import('@/components/MapPreview'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="relative bg-white min-h-screen">
      <Hero />
      <HowItWorks />
      <Statistics />
      <Features />
      <section
        id="discovery-preview"
        className="relative bg-white py-24"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {/* Subtle animated techy background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="w-full h-full animate-pulse opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20px 20px, #a78bfa 1px, transparent 1px), radial-gradient(circle at 60px 60px, #a78bfa 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="relative inline-block">
              <h2
                className="text-4xl md:text-5xl font-light tracking-[-0.02em] text-neutral-900 mb-4 font-serif"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Discover Local Fashion
              </h2>
              <motion.div
                className="absolute left-0 right-0 bottom-0 h-0.5 bg-purple-200 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{ originX: 0 }}
              />
            </div>
            <p
              className="text-xl text-neutral-800 font-light max-w-xl mx-auto font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Explore real-time inventory from local boutiques and discover
              unique pieces near you
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Link href="/threadress" className="block group relative">
                <motion.button
                  className="px-12 py-4 border border-purple-300 text-purple-700 rounded-full font-serif bg-white hover:bg-purple-50 transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-purple-200 text-lg relative overflow-hidden"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Prototype
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-0 group-hover:w-3/4 h-0.5 bg-purple-300 transition-all duration-300" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link href="/map" className="block group relative">
                <motion.button
                  className="px-12 py-4 border border-gray-300 text-gray-700 rounded-full font-serif bg-white hover:bg-gray-50 transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-lg relative overflow-hidden"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Find Boutiques
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-0 group-hover:w-3/4 h-0.5 bg-gray-300 transition-all duration-300" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Big AND divider - perfectly centered between buttons and waitlist */}
          <div className="w-full flex justify-center mb-0 mt-24">
            <span
              className="font-serif text-[7vw] md:text-[5vw] font-semibold select-none"
              style={{
                color: 'rgba(0,0,0,0.06)',
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              AND
            </span>
          </div>
        </div>
      </section>
      <WaitlistForm />
      <Footer />
    </main>
  );
}
