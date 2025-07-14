'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface ThreadLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export default function ThreadLoader({
  onComplete,
  duration = 2200,
}: ThreadLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          onComplete?.();
        }, 500);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Dainty thread path with SVG */}
            <svg
              width="70vw"
              height="120"
              viewBox="0 0 1200 120"
              fill="none"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: '70vw', height: 120 }}
            >
              {/* Thread path leading into the T */}
              <motion.path
                d="M 40 60 Q 300 30 600 60 Q 900 90 1080 60 Q 1120 60 1140 40"
                stroke="#222"
                strokeWidth="1.2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ filter: 'blur(0.1px)' }}
              />
              {/* Animated T logo at the end of the thread */}
              <g transform="translate(1110,0)">
                <motion.path
                  d="M 0 20 Q 24 20 48 20"
                  stroke="#222"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{
                    pathLength: progress > 90 ? (progress - 90) / 10 : 0,
                    opacity: progress > 90 ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 24 20 Q 24 50 40 64"
                  stroke="#222"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{
                    pathLength: progress > 95 ? (progress - 95) / 5 : 0,
                    opacity: progress > 95 ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </g>
            </svg>
            {/* No separate logo div; the T is now animated as part of the SVG above */}
            {/* Subtle background fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white/60 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
