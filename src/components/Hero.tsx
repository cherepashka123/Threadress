// src/components/Hero.tsx
'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();

  const mockups = [
    { src: '/3.png', alt: 'Threadress app main screen' },
    { src: '/5.png', alt: 'Threadress app interface' },
    { src: '/1.png', alt: 'Threadress app experience' },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % mockups.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Calculate positions for the tech stack effect - more spread out
  const getPosition = (index: number) => {
    const isActive = index === activeIndex;
    const diff = (index - activeIndex + mockups.length) % mockups.length;
    const baseRotate = -12; // Reduced rotation for cleaner look

    if (diff === 0)
      return {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 30,
        rotate: 0,
        opacity: 1,
      };
    if (diff === 1)
      return {
        x: '60%',
        y: '8%',
        scale: 0.85,
        zIndex: 20,
        rotate: baseRotate,
        opacity: 0.7,
      };
    return {
      x: '-60%',
      y: '8%',
      scale: 0.85,
      zIndex: 10,
      rotate: -baseRotate,
      opacity: 0.7,
    };
  };

  return (
    <section className="relative bg-[#fafafa] pt-0 pb-24 overflow-hidden">
      {/* Tech-inspired background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.02), transparent 50%)`,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />

        {/* Subtle tech pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* Text content */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4 md:space-y-6">
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.02em] text-neutral-900 leading-[1.2]">
              <div className="overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Discover
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Local Fashion,
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-normal"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    backgroundPosition: ['200% 0', '-200% 0'],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 1.2 },
                    backgroundPosition: {
                      duration: 10,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }}
                >
                  Reimagined
                </motion.span>
              </div>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-neutral-600 max-w-xl mx-auto md:mx-0 relative md:pr-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <motion.span
                initial={{ display: 'inline' }}
                className="typing-text"
              >
                Experience the future of fashion discovery. Find unique pieces,
                connect with local boutiques, and get personalized
                recommendations in one app.
              </motion.span>
            </motion.p>

            <style jsx>{`
              .typing-text {
                display: inline-block;
                border-right: 2px solid transparent;
                animation:
                  typing 3s steps(40, end),
                  blink-caret 0.75s step-end infinite;
                white-space: pre-wrap;
                overflow: hidden;
                max-width: 0;
              }

              @keyframes typing {
                from {
                  max-width: 0;
                }
                to {
                  max-width: 100%;
                }
              }

              @keyframes blink-caret {
                from,
                to {
                  border-color: transparent;
                }
                50% {
                  border-color: #6366f1;
                }
              }
            `}</style>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="#waitlist">
                <motion.button
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                  <span className="relative z-10">Join the Waitlist</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive mockups */}
        <motion.div
          className="w-full md:w-1/2 relative px-4 sm:px-6 md:px-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] mx-auto">
            <AnimatePresence mode="popLayout">
              {mockups.map((mockup, index) => {
                const pos = getPosition(index);
                return (
                  <motion.div
                    key={mockup.src}
                    className="absolute top-1/2 left-1/2 w-full cursor-pointer"
                    initial={{ opacity: 0, x: '-50%', y: '-50%' }}
                    animate={{
                      x: `calc(-50% + ${pos.x})`,
                      y: `calc(-50% + ${pos.y})`,
                      scale: pos.scale,
                      zIndex: pos.zIndex,
                      rotate: pos.rotate,
                      opacity: pos.opacity,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 40,
                      mass: 0.8,
                    }}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                    whileHover={{
                      scale: pos.scale * 1.03,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <motion.div
                      className="relative group"
                      animate={{
                        y: [-1, 1, -1],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {/* Professional glow effect */}
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      />

                      {/* Tech scan lines effect */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%)`,
                        }}
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />

                      {/* Modern iPhone mockup */}
                      <div className="relative w-full">
                        {/* iPhone frame - modern and thin */}
                        <div className="relative w-full aspect-[9/19.5] bg-black rounded-[2.5rem] p-1 shadow-2xl">
                          {/* iPhone screen bezel - very thin */}
                          <div className="w-full h-full bg-black rounded-[2.25rem] p-0.5">
                            {/* iPhone screen */}
                            <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                              {/* Dynamic Island - modern size */}
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full z-10"></div>

                              {/* Screen content */}
                              <div className="w-full h-full relative pt-6">
                                <img
                                  src={mockup.src}
                                  alt={mockup.alt}
                                  className="w-full h-full object-contain bg-white"
                                  style={{
                                    backfaceVisibility: 'hidden',
                                  }}
                                />

                                {/* Screen reflection */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

                                {/* Screen glow effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-purple-500/15 pointer-events-none"
                                  animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* iPhone buttons - very subtle */}
                          <div className="absolute right-0 top-1/4 w-0.5 h-6 bg-gray-800 rounded-l-full"></div>
                          <div className="absolute right-0 top-1/3 w-0.5 h-4 bg-gray-800 rounded-l-full"></div>
                          <div className="absolute left-0 top-1/2 w-0.5 h-8 bg-gray-800 rounded-r-full"></div>

                          {/* iPhone camera module - modern design */}
                          <div className="absolute top-3 right-3 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          </div>

                          {/* iPhone frame highlight - subtle */}
                          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-gray-300/10 via-transparent to-gray-700/10 pointer-events-none"></div>
                        </div>

                        {/* iPhone shadow */}
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-black/20 rounded-full blur-xl"></div>

                        {/* Tech glow effect */}
                        <motion.div
                          className="absolute -inset-3 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/15 rounded-[3rem] blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.02, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </div>

                      {/* Professional highlight */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.01 }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Professional indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {mockups.map((_, index) => (
              <motion.button
                key={index}
                className={`relative h-1 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-6 bg-indigo-600'
                    : 'w-3 bg-neutral-300 hover:bg-neutral-400'
                }`}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 hover:opacity-30 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Flowing text section */}
      <div className="relative bg-gradient-to-b from-[#fafafa] to-white overflow-hidden py-6">
        {/* Tech pattern background */}
        <motion.div
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Flowing line */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['100% 0%', '-100% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Moving text container */}
        <div className="max-w-[100vw] overflow-hidden">
          <div className="flex whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-16 px-8"
                animate={{
                  x: [0, -1920],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ x: 0 }}
              >
                <span className="text-neutral-400 font-light tracking-[0.2em] text-lg">
                  DISCOVER
                </span>
                <span className="text-indigo-600 font-light tracking-[0.2em] text-lg">
                  CONNECT
                </span>
                <span className="text-neutral-400 font-light tracking-[0.2em] text-lg">
                  STYLE
                </span>
                <span className="text-indigo-600 font-light tracking-[0.2em] text-lg">
                  INNOVATE
                </span>
                <span className="text-neutral-400 font-light tracking-[0.2em] text-lg">
                  FUTURE
                </span>
                <span className="text-indigo-600 font-light tracking-[0.2em] text-lg">
                  FASHION
                </span>
                <span className="text-neutral-400 font-light tracking-[0.2em] text-lg">
                  LOCAL
                </span>
                <span className="text-indigo-600 font-light tracking-[0.2em] text-lg">
                  SUSTAINABLE
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech circuit lines */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute left-0 w-full h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)',
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
    </section>
  );
}
