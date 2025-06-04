// src/components/Hero.tsx
'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();

  const mockups = [
    { src: '/mockup.png', alt: 'Threadress app main screen' },
    { src: '/3.png', alt: 'Threadress app features' },
    { src: '/5.png', alt: 'Threadress app experience' },
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate positions for the tech stack effect
  const getPosition = (index: number) => {
    const isActive = index === activeIndex;
    const diff = (index - activeIndex + mockups.length) % mockups.length;
    const baseRotate = -15; // Base rotation angle

    if (diff === 0)
      return {
        // Active
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 30,
        rotate: 0,
        opacity: 1,
      };
    if (diff === 1)
      return {
        // Right
        x: '40%',
        y: '5%',
        scale: 0.9,
        zIndex: 20,
        rotate: baseRotate,
        opacity: 0.8,
      };
    return {
      // Left
      x: '-40%',
      y: '5%',
      scale: 0.9,
      zIndex: 10,
      rotate: -baseRotate,
      opacity: 0.8,
    };
  };

  return (
    <section className="relative bg-[#fafafa] py-24 overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Text content */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6">
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.02em] text-neutral-900 leading-[1.1]">
              <div className="overflow-hidden">
                <motion.span className="block">Discover</motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span className="block">Local Fashion,</motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-normal"
                  initial={{ y: 40 }}
                  animate={{
                    y: 0,
                    backgroundPosition: ['200% 0', '-200% 0'],
                  }}
                  transition={{
                    y: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
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
              className="text-[1.1rem] text-neutral-800 font-light leading-[1.6] max-w-[32rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              AI-driven style & fit matching, real-time boutique inventory, and
              instant click-to-collect. All in one app.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10"
            >
              <motion.a
                href="#waitlist"
                className="group relative inline-flex items-center bg-neutral-900 text-white/95 font-light px-6 py-2.5 rounded-lg transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.01 }}
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
                <span className="relative z-10">Join Waitlist</span>
                <svg
                  className="w-4 h-4 ml-2 relative z-10 opacity-80"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 8H15M15 8L8 1M15 8L8 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Tech Mockup Showcase */}
        <motion.div
          className="md:w-1/2 flex justify-center relative h-[600px] perspective-[1200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full max-w-[400px] h-full flex items-center justify-center">
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
                      stiffness: 300,
                      damping: 30,
                      mass: 1,
                    }}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                    whileHover={{
                      scale: pos.scale * 1.05,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.div
                      className="relative group"
                      animate={{
                        y: [-2, 2, -2],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {/* Glowing effect */}
                      <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      />

                      {/* Tech lines effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl overflow-hidden"
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, rgba(139,111,95,0.03) 50%, transparent 100%)`,
                        }}
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />

                      {/* Main image */}
                      <img
                        src={mockup.src}
                        alt={mockup.alt}
                        className="relative w-full rounded-xl shadow-xl transition-transform duration-300"
                        style={{
                          transform: `perspective(1000px) rotateY(${pos.rotate}deg)`,
                          backfaceVisibility: 'hidden',
                        }}
                      />

                      {/* Interactive highlight */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.02 }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Tech indicators */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {mockups.map((_, index) => (
              <motion.button
                key={index}
                className={`relative h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-8 bg-[#8b6f5f]'
                    : 'w-4 bg-[#8b6f5f]/20'
                }`}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 hover:opacity-30 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
