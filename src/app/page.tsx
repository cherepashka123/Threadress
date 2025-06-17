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
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import WaitlistForm from '@/components/WaitlistForm';

// Dynamically load MapPreview on client only
const MapPreviewComponent = dynamic(() => import('@/components/MapPreview'), {
  ssr: false,
});

// Interactive Stitch Divider Component
function StitchDivider() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  // Smooth out the progress animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 120,
  });

  // Transform values for the flowing animation
  const lineProgress = useTransform(smoothProgress, [0, 0.5], [0, 100]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="relative w-full h-16 overflow-visible my-6 bg-white"
    >
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex flex-col items-center"
        style={{ opacity }}
      >
        {/* Thread shadow for depth */}
        <motion.div
          className="absolute top-0 w-[2px] blur-[0.5px] bg-gradient-to-b from-gray-400/60 via-gray-500/80 to-gray-400/60"
          style={{ height: lineProgress.get() + '%' }}
        />

        {/* Main thread line */}
        <motion.div
          className="absolute top-0 w-[2px] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-700"
          style={{ height: lineProgress.get() + '%' }}
        />

        {/* Animated stitches */}
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-5"
            style={{
              top: `${(index + 1) * (100 / 9)}%`,
              opacity: useTransform(
                smoothProgress,
                [index / 8, (index + 2) / 8],
                [0, 1]
              ),
            }}
          >
            {/* Stitch shadow */}
            <motion.div
              className="absolute inset-0 h-[2px] w-full bg-gray-400/60 blur-[0.5px]"
              style={{
                scaleX: useTransform(
                  smoothProgress,
                  [index / 8, (index + 0.5) / 8],
                  [0, 1]
                ),
                originX: index % 2 === 0 ? 0 : 1,
              }}
            />

            {/* Main stitch line */}
            <motion.div
              className="h-[2px] w-full bg-gray-800"
              style={{
                scaleX: useTransform(
                  smoothProgress,
                  [index / 8, (index + 0.5) / 8],
                  [0, 1]
                ),
                originX: index % 2 === 0 ? 0 : 1,
              }}
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          </motion.div>
        ))}

        {/* Moving needle effect */}
        <motion.div
          className="absolute w-1.5 h-6"
          style={{
            top: useTransform(smoothProgress, [0, 1], ['0%', '100%']),
          }}
        >
          <motion.div
            className="w-[2px] h-full bg-gradient-to-b from-gray-800 via-gray-700 to-transparent"
            animate={{
              y: [0, 8, 0],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Thread tension effect */}
        <motion.div
          className="absolute w-16 h-[1.5px]"
          style={{
            top: useTransform(smoothProgress, [0, 1], ['0%', '100%']),
            background:
              'linear-gradient(to right, transparent, rgb(55 65 81 / 0.4), transparent)',
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0]),
          }}
        />

        {/* Subtle glow effect */}
        <motion.div
          className="absolute top-0 w-[6px] blur-[2px] bg-gradient-to-b from-gray-600/20 via-gray-700/30 to-gray-600/20"
          style={{
            height: lineProgress.get() + '%',
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.3, 0]),
          }}
        />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative bg-white min-h-screen">
      <Hero />
      <StitchDivider />
      <Mission />
      <StitchDivider />
      <HowItWorks />
      <StitchDivider />
      <section id="discovery-preview" className="relative bg-[#fafafa] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
              Discover Local Fashion
            </h2>
            <p className="text-neutral-800 font-light max-w-xl mx-auto">
              Explore real-time inventory from local boutiques and discover
              unique pieces near you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            {/* Left: Search Component */}
            <div className="relative">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-light"
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        1
                      </motion.div>
                      <motion.div
                        className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neutral-200 to-transparent"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-light text-neutral-500 mb-1">
                        Smart Search
                      </div>
                      <h3 className="text-xl font-medium text-neutral-900 mb-4">
                        Find What You Need
                      </h3>
                      <motion.div
                        className="bg-white rounded-xl border border-neutral-200/50 shadow-sm overflow-hidden h-[480px] p-6"
                        whileHover={{ y: -4 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Search />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Map Preview */}
            <div className="relative">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-light"
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        2
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-light text-neutral-500 mb-1">
                        Local Discovery
                      </div>
                      <h3 className="text-xl font-medium text-neutral-900 mb-4">
                        Find Boutiques Near You
                      </h3>
                      <Link href="/map" className="block">
                        <motion.div
                          className="bg-white rounded-xl border border-neutral-200/50 shadow-sm overflow-hidden h-[480px]"
                          whileHover={{ y: -4 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <div className="h-full">
                            <MapPreviewComponent />
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <StitchDivider />
      <Features />
      <StitchDivider />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
