'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function StitchDivider() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smooth out the progress animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  // Transform values for the stitch animation
  const lineProgress = useTransform(smoothProgress, [0, 0.7], [0, 100]);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0, 0.8, 0.8, 0]
  );

  // Generate stitch points
  const stitches = Array.from({ length: 8 });

  return (
    <div ref={ref} className="relative w-full h-32 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex flex-col items-center"
        style={{ opacity }}
      >
        {/* Thread line */}
        <motion.div
          className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-gray-300/50 to-transparent"
          style={{ height: lineProgress.get() + '%' }}
        />

        {/* Stitch points */}
        {stitches.map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-3"
            style={{
              top: `${(index + 1) * (100 / (stitches.length + 1))}%`,
              opacity: useTransform(
                smoothProgress,
                [index / stitches.length, (index + 1) / stitches.length],
                [0, 1]
              ),
            }}
          >
            {/* Stitch dash */}
            <motion.div
              className="h-[1px] w-full bg-gray-300/50"
              style={{
                scaleX: useTransform(
                  smoothProgress,
                  [index / stitches.length, (index + 0.2) / stitches.length],
                  [0, 1]
                ),
                originX: index % 2 === 0 ? 0 : 1,
              }}
            />
          </motion.div>
        ))}

        {/* Moving needle effect */}
        <motion.div
          className="absolute w-1 h-1"
          style={{
            top: useTransform(smoothProgress, [0, 1], ['0%', '100%']),
          }}
        >
          <motion.div
            className="w-[1px] h-3 bg-gradient-to-b from-gray-400/60 to-transparent"
            animate={{
              y: [0, 4, 0],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Fabric edge effect */}
        <motion.div
          className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 w-8 h-[1px]"
          style={{
            opacity: useTransform(smoothProgress, [0.8, 1], [0, 0.15]),
            background:
              'linear-gradient(to right, transparent, rgb(209 213 219 / 0.3), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
}
