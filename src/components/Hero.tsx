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
    <section className="relative bg-[#f4efe9] py-16 px-6 md:px-12 rounded-b-3xl overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b6f5f]/5 to-transparent"
          animate={{
            y: [0, 800, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b6f5f]/3 to-transparent"
          animate={{
            y: [800, 0, 800],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8b6f5f]/5 to-transparent blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            scale: [1, 1.05, 1],
          }}
          transition={{
            scale: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            x: { type: 'spring', stiffness: 50, damping: 30 },
            y: { type: 'spring', stiffness: 50, damping: 30 },
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#8b6f5f]/5 to-transparent blur-3xl"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
            scale: [1, 1.1, 1],
          }}
          transition={{
            scale: {
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            x: { type: 'spring', stiffness: 50, damping: 30 },
            y: { type: 'spring', stiffness: 50, damping: 30 },
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text content */}
        <motion.div
          className="md:w-1/2 text-center md:text-left space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block">Discover</span>{' '}
            <span className="inline-block">Local Fashion,</span>{' '}
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#8b6f5f] to-[#a58d7f]">
              Reimagined
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI-driven style & fit matching, real-time boutique inventory, and
            instant click-to-collect. All in one app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href="#waitlist"
              className="group relative inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Join the Waitlist</span>
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.a>
          </motion.div>
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
