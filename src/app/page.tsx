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
    <div ref={ref} className="relative w-full h-16 overflow-visible my-6">
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex flex-col items-center"
        style={{ opacity }}
      >
        {/* Thread shadow for depth */}
        <motion.div
          className="absolute top-0 w-[2px] blur-[0.5px] bg-gradient-to-b from-gray-300/40 via-gray-300/60 to-gray-300/40"
          style={{ height: lineProgress.get() + '%' }}
        />

        {/* Main thread line */}
        <motion.div
          className="absolute top-0 w-[1.5px] bg-gradient-to-b from-gray-500/80 via-gray-600 to-gray-500/80"
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
              className="absolute inset-0 h-[1.5px] w-full bg-gray-300/40 blur-[0.5px]"
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
              className="h-[1.5px] w-full bg-gray-600"
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
            className="w-[1.5px] h-full bg-gradient-to-b from-gray-700 via-gray-600 to-transparent"
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
              'linear-gradient(to right, transparent, rgb(75 85 99 / 0.4), transparent)',
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0]),
          }}
        />

        {/* Subtle glow effect */}
        <motion.div
          className="absolute top-0 w-[4px] blur-[2px] bg-gradient-to-b from-gray-400/10 via-gray-400/20 to-gray-400/10"
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
    <main className="relative">
      <Hero />
      <StitchDivider />
      <Mission />
      <StitchDivider />
      <section className="py-8 relative overflow-hidden" id="browse-preview">
        {/* Interactive background elements */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-[20%] w-32 h-32 rounded-full bg-gradient-to-r from-violet-100/20 to-transparent blur-xl"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-40 right-[30%] w-40 h-40 rounded-full bg-gradient-to-r from-indigo-100/20 to-transparent blur-xl"
            animate={{
              y: [0, 20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </motion.div>

        {/* Section content */}
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <div className="relative inline-block">
              {/* Animated decorative elements */}
              <motion.div
                className="absolute -left-8 -top-8 w-16 h-16"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="w-full h-full rounded-full border border-violet-200"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              <h2 className="text-3xl font-[500] tracking-tight mb-4 relative">
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Discover Local Fashion
                </motion.span>
                <motion.div
                  className="absolute -right-3 -top-3 w-6 h-6 border border-violet-200 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              </h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Explore real-time inventory from local boutiques and discover
                unique pieces near you
              </motion.p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Search Component */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-sm bg-white/90 rounded-2xl border border-violet-100/20 shadow-lg shadow-violet-100/20 p-1 hover:shadow-xl hover:shadow-violet-100/30 transition-all duration-300"
            >
              <Search />
            </motion.div>

            {/* Right: Interactive Map Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="group"
            >
              <Link href="/map" className="block relative">
                <div className="overflow-hidden rounded-2xl backdrop-blur-sm bg-white/90 border border-violet-100/20 shadow-lg shadow-violet-100/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-100/30">
                  <MapPreviewComponent />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    whileHover={{ opacity: 1 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.p
                      className="text-sm text-violet-700 bg-white/95 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm border border-violet-100/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-violet-50"
                      whileHover={{ y: -2 }}
                    >
                      View full map
                    </motion.p>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <StitchDivider />
      <HowItWorks />
      <StitchDivider />
      <section className="py-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-3">
          Join Our Community
        </h2>
        <Prototype />
      </section>

      <StitchDivider />
      <Features />
      <StitchDivider />
      <section id="waitlist" className="py-6">
        <h2 className="text-2xl font-bold text-center mb-3">
          Join the Waitlist
        </h2>
        <SignupForm />
      </section>

      <StitchDivider />
      <Contact />
      <Footer />
    </main>
  );
}
