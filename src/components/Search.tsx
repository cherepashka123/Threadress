// src/components/Search.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { items, Item } from '@/data/items';
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import dynamic from 'next/dynamic';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      {/* Main cursor (needle) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full transform rotate-45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </svg>
      </motion.div>

      {/* Thread effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{
              x: 0,
              y: 0,
              scale: 0.5 - i * 0.1,
            }}
            animate={{
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Tech ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-30 border-2 border-white/30 rounded-full mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </>
  );
};

const ParticleEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; vx: number; vy: number; life: number }>
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) => {
        // Update existing particles
        const updatedParticles = prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0);

        // Add new particles near mouse position
        if (mousePosition.x !== 0 && mousePosition.y !== 0) {
          const newParticle = {
            x: mousePosition.x,
            y: mousePosition.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 50,
          };
          return [...updatedParticles, newParticle];
        }

        return updatedParticles;
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [mousePosition]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{
            x: particle.x,
            y: particle.y,
            opacity: particle.life / 50,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}
    </div>
  );
};

// Wrap the component with dynamic import
const DynamicParticleEffect = dynamic(() => Promise.resolve(ParticleEffect), {
  ssr: false,
});

const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, #8b6f5f 1px, transparent 1px),
        linear-gradient(to bottom, #8b6f5f 1px, transparent 1px)
      `,
        backgroundSize: '24px 24px',
      }}
    />
  </div>
);

export default function Search() {
  const [q, setQ] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = items.filter((item) =>
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  // Handle click outside to blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto relative"
    >
      <CustomCursor />
      <DynamicParticleEffect />
      <GridPattern />

      {/* Search input with enhanced animations */}
      <div className="relative text-gray-600 mb-8">
        <motion.div
          className="absolute -inset-3 rounded-[28px] bg-gradient-to-r from-purple-500/30 via-fuchsia-500/30 to-pink-500/30 opacity-0 blur-xl transition-all duration-500"
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
        />
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{
              opacity: isFocused ? 0.1 : 0,
            }}
          />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search items..."
            className="
              w-full 
              h-14
              px-8
              py-4
              rounded-[24px]
              border-2 border-gray-200/50
              bg-white/90
              backdrop-blur-xl
              shadow-lg
              focus:outline-none 
              focus:border-transparent
              placeholder-gray-400
              transition-all
              duration-300
              relative
              z-10
              text-lg
            "
          />
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
            animate={{
              scale: q ? 1.1 : 1,
            }}
          >
            {q && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => setQ('')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1010 3a7 7 0 006.65 13.65z"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Results Grid */}
      <AnimatePresence mode="wait">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item: Item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                className="
                  absolute 
                  inset-0 
                  rounded-2xl 
                  bg-gradient-to-r 
                  from-purple-500/20 
                  to-pink-500/20 
                  blur-xl
                  opacity-0
                  group-hover:opacity-70
                  transition-opacity
                  duration-500
                "
              />
              <div
                className="
                  relative 
                  bg-white/80
                  backdrop-blur-xl
                  rounded-2xl 
                  p-6
                  border border-white/40
                  transition-all 
                  duration-500
                  hover:border-transparent
                  hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)]
                  hover:bg-white/90
                  overflow-hidden
                  flex
                  gap-6
                "
              >
                {/* Tech lines effect */}
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    background: [
                      'linear-gradient(to right, rgba(139,111,95,0.03) 0%, transparent 100%)',
                      'linear-gradient(to right, transparent 0%, rgba(139,111,95,0.03) 50%, transparent 100%)',
                      'linear-gradient(to right, transparent 0%, rgba(139,111,95,0.03) 100%)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Image with enhanced hover effects */}
                <motion.div
                  className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Content with tech accents */}
                <div className="flex-1 relative">
                  <motion.div
                    className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 opacity-50"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <h3 className="text-xl font-medium text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    {item.name}
                  </h3>
                  <motion.p
                    className="text-lg font-medium mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    ${item.price.toFixed(2)}
                  </motion.p>

                  {/* Tech details */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>In stock nearby</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Enhanced "No results" state */}
          {results.length === 0 && (
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                className="
                relative
                text-center 
                py-16
                px-6
                rounded-2xl
                bg-white/80
                backdrop-blur-xl
                border border-white/40
                overflow-hidden
              "
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 0%, rgba(139,111,95,0.03) 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 100%, rgba(139,111,95,0.03) 0%, transparent 50%)',
                      'radial-gradient(circle at 0% 0%, rgba(139,111,95,0.03) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or browse all items
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
