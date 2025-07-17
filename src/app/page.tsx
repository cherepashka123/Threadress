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
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.1, ease: 'easeInOut' }}
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[-0.02em] text-neutral-900 mb-4 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Discover Local Fashion
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
              className="text-base sm:text-xl text-neutral-800 font-light max-w-xl mx-auto font-serif mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Explore real-time inventory from local boutiques and discover
              unique pieces near you
            </motion.p>
          </motion.div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 justify-center items-center mb-12 w-full max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
            >
              <Link
                href="/threadress"
                className="block group relative w-full sm:w-auto"
              >
                <button
                  className="w-full sm:w-auto px-8 sm:px-12 py-4 border border-gray-300 text-gray-900 rounded-full font-serif bg-white hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-lg relative overflow-hidden"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'white',
                  }}
                >
                  Try Prototype
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: 'easeInOut' }}
            >
              <Link
                href="/map"
                className="block group relative w-full sm:w-auto"
              >
                <button
                  className="w-full sm:w-auto px-8 sm:px-12 py-4 border border-gray-300 text-gray-900 rounded-full font-serif bg-white hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-lg relative overflow-hidden"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'white',
                  }}
                >
                  Find Boutiques
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Minimal AND divider - lighter and more minimal */}
          <div className="w-full flex justify-center mb-8 mt-20 sm:mt-32">
            <span
              className="font-serif text-[10vw] sm:text-[7vw] md:text-[5vw] font-semibold select-none"
              style={{
                color: 'rgba(0,0,0,0.03)',
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
