// src/components/Hero.tsx
'use client';

import {
  motion,
  useAnimation,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const controls = useAnimation();
  const fabricRef = useRef<HTMLDivElement>(null);

  // Mouse motion values for smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const mockups = [
    { src: '/3.png', alt: 'Threadress app main screen' },
    { src: '/5.png', alt: 'Threadress app interface' },
    { src: '/1.png', alt: 'Threadress app experience' },
  ];

  // Hydration fix: only render random-positioned elements on client
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % mockups.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate positions for the floating portals
  const getPortalPosition = (index: number) => {
    const isActive = index === activeIndex;
    const diff = (index - activeIndex + mockups.length) % mockups.length;
    const baseRotate = -8;

    if (diff === 0)
      return {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 30,
        rotate: 0,
        opacity: 1,
        z: 0,
      };
    if (diff === 1)
      return {
        x: '45%',
        y: '10%',
        scale: 0.8,
        zIndex: 20,
        rotate: baseRotate,
        opacity: 0.8,
        z: -50,
      };
    return {
      x: '-45%',
      y: '10%',
      scale: 0.8,
      zIndex: 10,
      rotate: -baseRotate,
      opacity: 0.8,
      z: -50,
    };
  };

  // Generate fabric threads only on client to avoid hydration issues
  const fabricThreads = useMemo(() => {
    if (!hasMounted) return [];
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
  }, [hasMounted]);

  // Refs for thread animation
  const mockupRef = useRef<HTMLDivElement>(null);
  const localFashionRef = useRef<HTMLSpanElement>(null);
  const [threadPos, setThreadPos] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  } | null>(null);

  // Calculate thread start/end after mount and on resize
  useLayoutEffect(() => {
    function updateThreadPos() {
      if (mockupRef.current && localFashionRef.current) {
        const mockupRect = mockupRef.current.getBoundingClientRect();
        const textRect = localFashionRef.current.getBoundingClientRect();
        // Start at right center of mockup
        const start = {
          x: mockupRect.right,
          y: mockupRect.top + mockupRect.height / 2,
        };
        // End at left center of 'Local Fashion' text
        const end = {
          x: textRect.left,
          y: textRect.top + textRect.height / 2,
        };
        setThreadPos({ start, end });
      }
    }
    updateThreadPos();
    window.addEventListener('resize', updateThreadPos);
    return () => window.removeEventListener('resize', updateThreadPos);
  }, [hasMounted]);

  return (
    <section className="relative bg-white min-h-screen overflow-hidden">
      {/* Animated Thread Connector Network */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Thread connections between screens */}
        {mockups.map((_, index) => {
          const nextIndex = (index + 1) % mockups.length;
          const pos1 = getPortalPosition(index);
          const pos2 = getPortalPosition(nextIndex);

          return (
            <motion.div
              key={`thread-${index}`}
              className="absolute top-1/2 left-1/2 w-px h-16 bg-gradient-to-b from-purple-400/40 to-purple-300/40"
              style={{
                transformOrigin: 'center',
                left: `calc(50% + ${parseFloat(pos1.x.toString()) / 2}%)`,
                top: `calc(50% + ${parseFloat(pos1.y.toString()) / 2}%)`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scaleY: [0.8, 1.2, 0.8],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.5,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Particle threads flowing between screens */}
        {hasMounted &&
          Array.from({ length: 30 }).map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 3;
            const randomDuration = 6 + Math.random() * 4;

            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  delay: randomDelay,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
      </div>

      {/* Morphing Fabric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-purple-300/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            borderRadius: ['50%', '30%', '50%'],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-purple-200/10 rounded-full blur-xl"
          animate={{
            scale: [1.5, 1, 1.5],
            borderRadius: ['30%', '50%', '30%'],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div
        className="relative max-w-7xl mx-auto px-4 md:px-6 pt-0 pb-0 flex flex-col md:flex-row items-center justify-between gap-0 md:gap-2"
        style={{ marginTop: 0 }}
      >
        {/* Text content */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left relative z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4 md:space-y-6">
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.02em] text-gray-800 leading-[1.2]">
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
                  ref={localFashionRef}
                >
                  Local Fashion,
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent font-normal"
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
              className="text-base md:text-lg text-gray-600 max-w-xl mx-auto md:mx-0 relative md:pr-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              Discover in-stock fashion from local boutiques, get personalized
              AI recommendations, and reserve items for quick pickup - all in
              one app.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-lg relative overflow-hidden group backdrop-blur-sm border border-purple-400/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById('waitlist');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-300/30 via-purple-400/30 to-purple-300/30 bg-[length:200%_100%]"
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
            </motion.div>
          </div>
        </motion.div>

        {/* Single Mockup_1.png centered and prominent with movement */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative px-2 sm:px-4 md:px-0 mt-[-160px]">
          <motion.div
            className="relative w-full max-w-[480px] sm:max-w-[560px] md:max-w-[640px] mx-auto aspect-[9/19.5] scale-135"
            animate={{
              y: [0, -12, 0, 12, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            ref={mockupRef}
          >
            <img
              src="/Mockup_1.png"
              alt="Threadress app mockup"
              className="w-full h-full object-contain drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 8px 32px rgba(167, 139, 250, 0.15))',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Floating fabric particles and thread lines (client-only for hydration fix) */}
      {hasMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {fabricThreads.slice(0, 40).map((thread) => (
            <motion.div
              key={thread.id}
              className="absolute w-0.5 h-0.5 bg-purple-300/30 rounded-full"
              style={{
                left: `${thread.x}%`,
                top: `${thread.y}%`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.08, 0.18, 0.08],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 6 + thread.delay,
                repeat: Infinity,
                delay: thread.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Subtle thread lines across the hero */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`thread-line-${i}`}
              className="absolute h-px bg-gradient-to-r from-purple-200/20 via-purple-300/30 to-purple-200/10"
              style={{
                top: `${15 + i * 12}%`,
                left: 0,
                width: '100%',
              }}
              animate={{
                opacity: [0.08, 0.16, 0.08],
                x: [0, 10 * (i % 2 === 0 ? 1 : -1), 0],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Thread-Spinning Loader Animation */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 pointer-events-none"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-full h-full border-2 border-purple-400/30 rounded-full relative">
          <motion.div
            className="absolute top-0 left-1/2 w-1 h-4 bg-purple-400/60 rounded-full"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </motion.div>

      {/* Ambient sound trigger (visual only - would need audio implementation) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isHovering
            ? 'radial-gradient(circle at center, rgba(167, 139, 250, 0.05) 0%, transparent 70%)'
            : 'transparent',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Subtle animated thread connecting phones to consumer */}
      <div className="absolute left-1/2 bottom-12 md:bottom-20 z-10 pointer-events-none w-full flex justify-center">
        <svg
          width="320"
          height="80"
          viewBox="0 0 320 80"
          fill="none"
          className="max-w-xs md:max-w-md"
          style={{ filter: 'blur(0.5px)' }}
        >
          <motion.path
            d="M40 40 Q160 0 280 40"
            stroke="#a78bfa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 8"
            initial={{ pathLength: 0, opacity: 0.12 }}
            animate={{ pathLength: 1, opacity: 0.22 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            fill="none"
          />
          {/* Store icon (left) */}
          <circle cx="40" cy="40" r="8" fill="#a78bfa" opacity="0.18" />
          <rect
            x="36"
            y="36"
            width="8"
            height="8"
            rx="2"
            fill="#fff"
            stroke="#a78bfa"
            strokeWidth="1.5"
            opacity="0.7"
          />
          {/* Consumer icon (right) */}
          <circle
            cx="280"
            cy="40"
            r="10"
            fill="#fff"
            stroke="#a78bfa"
            strokeWidth="2"
            opacity="0.7"
          />
          <circle cx="280" cy="38" r="3" fill="#a78bfa" opacity="0.7" />
          <ellipse
            cx="280"
            cy="46"
            rx="4"
            ry="2"
            fill="#a78bfa"
            opacity="0.12"
          />
        </svg>
      </div>

      {/* Subtle animated thread with improved needle, always below text */}
      {threadPos && (
        <div
          className="absolute z-10 pointer-events-none w-full h-0"
          style={{ left: 0, top: 0 }}
        >
          <svg
            width={Math.abs(threadPos.start.x - threadPos.end.x) + 100}
            height={Math.abs(threadPos.start.y - threadPos.end.y) + 100}
            style={{
              position: 'absolute',
              left: Math.min(threadPos.start.x, threadPos.end.x) - 50,
              top: Math.min(threadPos.start.y, threadPos.end.y) + 40, // move path lower to avoid text
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {/* Minimalist needle with thread loop */}
            <g>
              {/* Needle body */}
              <rect
                x={(threadPos.start.x > threadPos.end.x ? 100 : 0) - 1}
                y={18}
                width="2"
                height="28"
                rx="1"
                fill="#a78bfa"
                opacity="0.85"
                transform="rotate(-18)"
              />
              {/* Needle eye */}
              <ellipse
                cx={threadPos.start.x > threadPos.end.x ? 100 : 0}
                cy={22}
                rx="2"
                ry="1.1"
                fill="#fff"
                stroke="#a78bfa"
                strokeWidth="1"
                opacity="0.9"
              />
              {/* Thread loop through the eye */}
              <path
                d={`M ${(threadPos.start.x > threadPos.end.x ? 100 : 0) + 2},${22} Q ${(threadPos.start.x > threadPos.end.x ? 100 : 0) + 12},${12} ${(threadPos.start.x > threadPos.end.x ? 100 : 0) + 24},${22}`}
                stroke="#a78bfa"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </g>
            {/* Thread path - thinner, more elegant */}
            <motion.path
              d={`M ${threadPos.start.x > threadPos.end.x ? 100 : 0},${24} Q ${(threadPos.start.x > threadPos.end.x ? 100 : 0) + 120},${((threadPos.start.y > threadPos.end.y ? 100 : 0) + (threadPos.end.y > threadPos.start.y ? 100 : 0)) / 2 - 20} ${threadPos.end.x > threadPos.start.x ? 100 : Math.abs(threadPos.start.x - threadPos.end.x) + 100},${24}`}
              stroke="#a78bfa"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeDasharray="2 7"
              initial={{ pathLength: 0, opacity: 0.1 }}
              animate={{ pathLength: 1, opacity: 0.18 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Minimalist, clear needle & thread icon in top right corner */}
      <div className="absolute top-8 right-8 z-40 pointer-events-none">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          {/* Thread circle */}
          <circle
            cx="18"
            cy="18"
            r="13"
            stroke="#e9d8fd"
            strokeWidth="2"
            fill="none"
          />
          {/* Needle */}
          <rect
            x="22"
            y="7"
            width="2"
            height="14"
            rx="1"
            fill="#a78bfa"
            opacity="0.85"
            transform="rotate(25 22 7)"
          />
          {/* Needle eye */}
          <ellipse
            cx="23"
            cy="10"
            rx="1.2"
            ry="0.7"
            fill="#fff"
            stroke="#a78bfa"
            strokeWidth="0.7"
            opacity="0.9"
          />
          {/* Thread through the eye */}
          <path
            d="M24 10 Q28 13 22 18"
            stroke="#a78bfa"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Subtle thread from top-right icon to iPhone mockup */}
      <div className="absolute z-0 pointer-events-none w-full h-full">
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          {/* Calculate visually pleasing start/end points for most screens */}
          <path
            d="M 92% 4% Q 80% 18%, 68% 30% T 56% 60%"
            stroke="#a78bfa"
            strokeWidth="1.2"
            fill="none"
            opacity="0.18"
            style={{ filter: 'blur(0.2px)' }}
          />
        </svg>
      </div>
    </section>
  );
}
