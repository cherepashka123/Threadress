// src/components/HowItWorks.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

const steps = [
  {
    id: 1,
    title: 'Find it, Now.',
    subtitle: 'Start with what you need',
    description:
      "It's 4PM in NYC. You need a long gold dress tonight—but don't know where to start. Just describe your perfect piece.",
    visual: '/how-it-works/search.png',
    accent: 'from-indigo-400 to-purple-400',
    feature: 'Natural Language Search',
  },
  {
    id: 2,
    title: 'AI Style Match',
    subtitle: 'Beyond keywords',
    description:
      "Our AI understands style, shape, and mood—converting your description into a precise style vector that captures the essence of what you're seeking.",
    visual: '/how-it-works/ai-match.png',
    accent: 'from-purple-400 to-indigo-400',
    feature: 'Vector Search',
  },
  {
    id: 3,
    title: 'Local Discovery',
    subtitle: 'Real-time inventory',
    description:
      "We instantly scan local boutiques' inventories, matching your style to what's available nearby. See real-time stock and location.",
    visual: '/how-it-works/local.png',
    accent: 'from-indigo-400 to-purple-400',
    feature: 'Inventory Sync',
  },
  {
    id: 4,
    title: 'Instant Access',
    subtitle: 'Same-day gratification',
    description:
      'Reserve or buy in-app, pick up within hours. Try on in-store with the confidence of AI-powered matching.',
    visual: '/how-it-works/pickup.png',
    accent: 'from-purple-400 to-indigo-400',
    feature: 'Quick Pickup',
  },
  {
    id: 5,
    title: 'Perfect Match',
    subtitle: 'AI meets IRL',
    description:
      'Experience hyper-personalized fashion discovery—right around the corner. Your style, your schedule, your way.',
    visual: '/how-it-works/match.png',
    accent: 'from-indigo-400 to-purple-400',
    feature: 'Smart Shopping',
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-neutral-800 font-light max-w-xl mx-auto">
            Experience the future of local fashion discovery—powered by AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
          {/* Left: Steps */}
          <div className="relative">
            <div className="sticky top-24 space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.accent} flex items-center justify-center text-white font-light`}
                      >
                        {step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-purple-400/20 to-transparent" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-light text-neutral-500 mb-1">
                        {step.feature}
                      </div>
                      <h3 className="text-xl font-medium text-neutral-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-neutral-800 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Visualization */}
          <div className="relative">
            <div className="sticky top-24 h-[600px] rounded-2xl bg-gradient-to-b from-white to-neutral-50 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.02)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.02),transparent_50%)]" />

              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                  linear-gradient(to bottom, #000 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Content Container */}
              <div className="relative h-full flex items-center justify-center p-8">
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: activeStep === step.id ? 1 : 0,
                      scale: activeStep === step.id ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-[400px] aspect-square">
                      {/* Process Visualization Container */}
                      <div className="absolute inset-0 rounded-xl bg-white shadow-lg overflow-hidden">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50" />

                        {/* Grid Pattern */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                          }}
                          animate={{
                            backgroundPosition: ['0px 0px', '24px 24px'],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />

                        {/* Step-specific Visualizations */}
                        {step.id === 1 && (
                          <>
                            {/* Search Step */}
                            <motion.div
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-12 bg-white rounded-full shadow-lg border border-violet-100 flex items-center px-4"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.div
                                className="w-4 h-4 rounded-full bg-purple-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                              <motion.div
                                className="ml-3 h-4 flex-1 bg-purple-100 rounded-full overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                              >
                                <motion.div
                                  className="h-full w-full bg-purple-200"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </motion.div>
                            </motion.div>

                            {/* Floating Search Terms */}
                            {['dress', 'local', 'gold', 'evening'].map(
                              (term, i) => (
                                <motion.div
                                  key={term}
                                  className="absolute bg-white/90 px-3 py-1 rounded-full text-xs text-purple-500 shadow-sm"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: Math.cos((i * Math.PI) / 2) * 100,
                                    y: Math.sin((i * Math.PI) / 2) * 100,
                                  }}
                                  transition={{ delay: i * 0.2 }}
                                >
                                  {term}
                                </motion.div>
                              )
                            )}
                          </>
                        )}

                        {step.id === 2 && (
                          <>
                            {/* AI Matching Step */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                className="relative w-48 h-48"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 20,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                              >
                                {[...Array(8)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full bg-purple-400"
                                    style={{
                                      top: '50%',
                                      left: '50%',
                                      transform: `rotate(${i * 45}deg) translateY(-80px)`,
                                    }}
                                    animate={{
                                      scale: [1, 1.5, 1],
                                      opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.2,
                                    }}
                                  />
                                ))}
                              </motion.div>
                              <motion.div
                                className="absolute w-32 h-32 rounded-full bg-purple-400/20"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                          </>
                        )}

                        {step.id === 3 && (
                          <>
                            {/* Local Discovery Step */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div className="relative w-64 h-64">
                                {/* Map Background */}
                                <motion.div
                                  className="absolute inset-0 rounded-lg bg-violet-50"
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {/* Grid lines */}
                                  {[...Array(8)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute left-0 right-0 h-px bg-violet-200"
                                      style={{ top: `${(i + 1) * 12.5}%` }}
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 1 }}
                                      transition={{ delay: i * 0.1 }}
                                    />
                                  ))}
                                  {[...Array(8)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute top-0 bottom-0 w-px bg-violet-200"
                                      style={{ left: `${(i + 1) * 12.5}%` }}
                                      initial={{ scaleY: 0 }}
                                      animate={{ scaleY: 1 }}
                                      transition={{ delay: i * 0.1 }}
                                    />
                                  ))}
                                </motion.div>

                                {/* Store Locations */}
                                {[
                                  { x: 30, y: 40 },
                                  { x: 60, y: 30 },
                                  { x: 70, y: 60 },
                                  { x: 40, y: 70 },
                                ].map((pos, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-4 h-4"
                                    style={{
                                      left: `${pos.x}%`,
                                      top: `${pos.y}%`,
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.2 }}
                                  >
                                    <motion.div
                                      className="w-full h-full rounded-full bg-violet-400"
                                      animate={{ scale: [1, 1.5, 1] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                      }}
                                    />
                                    <motion.div
                                      className="absolute -inset-2 rounded-full border-2 border-violet-400"
                                      animate={{
                                        scale: [1, 2],
                                        opacity: [1, 0],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                      }}
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          </>
                        )}

                        {step.id === 4 && (
                          <>
                            {/* Instant Access Step */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div className="relative">
                                {/* Progress Circle */}
                                <svg
                                  className="w-32 h-32"
                                  viewBox="0 0 100 100"
                                >
                                  <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="2"
                                    strokeDasharray="283"
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                  />
                                </svg>

                                {/* Checkmark */}
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 1 }}
                                >
                                  <svg
                                    className="w-12 h-12 text-violet-500"
                                    viewBox="0 0 24 24"
                                  >
                                    <motion.path
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      d="M4 12l6 6L20 6"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 0.5, delay: 1.2 }}
                                    />
                                  </svg>
                                </motion.div>
                              </motion.div>
                            </div>
                          </>
                        )}

                        {step.id === 5 && (
                          <>
                            {/* Perfect Match Step */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                className="relative w-48 h-48"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {/* Success Animation */}
                                <motion.div
                                  className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 opacity-20"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }}
                                />

                                {/* Sparkles */}
                                {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full bg-violet-400"
                                    style={{
                                      top: '50%',
                                      left: '50%',
                                      transform: `rotate(${i * 30}deg) translateY(-60px)`,
                                    }}
                                    animate={{
                                      scale: [0, 1, 0],
                                      opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.1,
                                    }}
                                  />
                                ))}

                                {/* Center Icon */}
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <div className="w-16 h-16 rounded-full bg-purple-400 flex items-center justify-center text-white text-2xl">
                                    ✨
                                  </div>
                                </motion.div>
                              </motion.div>
                            </div>
                          </>
                        )}

                        {/* Step Progress Indicator */}
                        <motion.div
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-purple-100"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex gap-2">
                            {steps.map((s) => (
                              <motion.div
                                key={s.id}
                                className={`w-2 h-2 rounded-full ${
                                  s.id === step.id
                                    ? 'bg-purple-500'
                                    : 'bg-purple-200'
                                }`}
                                animate={{
                                  scale: s.id === step.id ? [1, 1.2, 1] : 1,
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: s.id === step.id ? Infinity : 0,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-24"
        >
          <a
            href="#waitlist"
            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-purple-400 text-white font-light px-8 py-3 rounded-lg transition-all duration-300 overflow-hidden group relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-purple-400/30 to-purple-400/30 bg-[length:200%_100%]"
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="relative z-10">Join the Waitlist</span>
            <svg
              className="w-4 h-4 ml-2 relative z-10 opacity-80 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M1 8H15M15 8L8 1M15 8L8 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
