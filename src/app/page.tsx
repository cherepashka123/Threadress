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
      <HowItWorks />
      <StitchDivider />
      <section className="relative bg-[#fafafa] py-24" id="browse-preview">
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
                        Browse Nearby
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
                          <motion.div
                            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white to-transparent py-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="text-center">
                              <motion.span
                                className="inline-flex items-center gap-2 text-sm text-neutral-600 font-light bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm"
                                whileHover={{ gap: '12px' }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 17,
                                }}
                              >
                                View full map
                                <motion.svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  initial={{ x: 0 }}
                                  whileHover={{ x: 4 }}
                                >
                                  <path
                                    d="M4 12h16m-4-4l4 4-4 4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </motion.svg>
                              </motion.span>
                            </div>
                          </motion.div>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Interactive flow element */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="h-px bg-neutral-200/50" />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neutral-300"
                animate={{
                  x: ['0%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <StitchDivider />
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#fafafa] to-white">
        {/* Tech-inspired background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/5 to-indigo-600/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/5 to-violet-600/5 rounded-full blur-3xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="relative inline-block mb-6">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '120%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute -left-[10%] top-[50%] h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"
              />
              <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900">
                Join Our Community
              </h2>
            </div>
            <p className="text-neutral-600 font-light max-w-xl mx-auto">
              Connect with fashion enthusiasts, discover local trends, and shape
              the future of sustainable style
            </p>
          </motion.div>

          {/* Original Prototype with enhanced container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-16 rounded-2xl overflow-hidden"
          >
            {/* Tech overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 mix-blend-overlay"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Animated border */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Original Prototype component */}
            <div className="relative z-10">
              <Prototype />
            </div>
          </motion.div>

          {/* Community stats and features */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Early Access Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-neutral-100 relative overflow-hidden group hover:border-indigo-200 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-neutral-900">
                      Early Access
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      Be among the first to experience
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Waitlist Progress</span>
                    <span className="text-indigo-600">75% Full</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Limited spots available for beta launch
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Smart Technology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-neutral-100 relative overflow-hidden group hover:border-indigo-200 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-neutral-900">
                      Smart Technology
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      AI-powered fashion discovery
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-neutral-600">
                      Neural style matching
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-sm text-neutral-600">
                      Real-time inventory sync
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm text-neutral-600">
                      Smart size prediction
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Future Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-neutral-100 relative overflow-hidden group hover:border-indigo-200 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-neutral-900">
                      Future Vision
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      Revolutionizing local retail
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <motion.div
                    className="h-1.5 bg-neutral-100 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <motion.div
                      className="h-full w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 bg-[length:200%_100%]"
                      animate={{
                        backgroundPosition: ['0% 0%', '200% 0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      Development Progress
                    </span>
                    <span className="text-indigo-600">Beta Phase</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="bg-neutral-50 rounded-lg p-2">
                      <div className="text-xs text-neutral-600">
                        Launch Target
                      </div>
                      <div className="text-sm font-medium text-indigo-600">
                        Q3 2025
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-2">
                      <div className="text-xs text-neutral-600">
                        Initial Cities
                      </div>
                      <div className="text-sm font-medium text-indigo-600">
                        5+
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="#waitlist"
              className="inline-flex items-center bg-neutral-900 text-white/95 font-light px-8 py-3 rounded-lg transition-all duration-300 overflow-hidden group relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-indigo-400/30 bg-[length:200%_100%]"
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Join the Movement
                <svg
                  className="w-4 h-4 opacity-80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
      <StitchDivider />
      <Features />
      <StitchDivider />
      <section id="waitlist" className="py-6">
        <SignupForm />
      </section>

      <StitchDivider />
      <Contact />
      <Footer />
    </main>
  );
}
