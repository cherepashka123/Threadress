// src/components/Features.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const features = [
    {
      title: 'Real-Time Inventory',
      description:
        'View live boutique stock levels instantly. Know exactly what is available.',
      icon: (
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
            strokeWidth={1.5}
            d="M3 3h18v18H3V3z M3 9h18M9 21V9M15 21V9"
          />
        </svg>
      ),
      gradient: 'from-purple-400 to-purple-400',
    },
    {
      title: 'Seamless Checkout',
      description:
        'One-click payments with flexible terms. Complete your purchase in seconds.',
      icon: (
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
            strokeWidth={1.5}
            d="M3 7h18M3 11h18M5 15h.01M9 15h.01M13 15h.01M17 15h.01M21 15H3m0-8v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
      gradient: 'from-purple-400 to-purple-400',
    },
    {
      title: 'Sustainable Shopping',
      description:
        'Discover eco-innovative boutiques. Support local businesses and sustainable fashion.',
      icon: (
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
            strokeWidth={1.5}
            d="M12 2a7 7 0 00-7 7c0 4.25 6 11 7 11s7-6.75 7-11a7 7 0 00-7-7z M9 10l3 3 3-3"
          />
        </svg>
      ),
      gradient: 'from-purple-400 to-purple-400',
    },
    {
      title: 'AI-Powered Match',
      description:
        'Smart size and style suggestions based on your profile. Perfect fit every time.',
      icon: (
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
            strokeWidth={1.5}
            d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z M6.343 17.657A8 8 0 0112 13a8 8 0 015.657 4.657M8.464 16.243a4 4 0 016.97 0"
          />
        </svg>
      ),
      gradient: 'from-purple-400 to-purple-400',
    },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={containerRef}
      className="py-24 bg-white overflow-hidden"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-light text-gray-900 mb-16 font-serif text-center"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Key Features
        </motion.h2>

        {/* Horizontal scrolling features */}
        <div className="relative">
          <motion.div
            className="flex gap-8"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Duplicate features for seamless loop */}
            {[...features, ...features].map((feature, index) => (
              <motion.div
                key={`${feature.title}-${index}`}
                className="bg-white rounded-xl p-8 border border-gray-100 text-center min-w-[320px] flex-shrink-0"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3
                  className="text-2xl font-semibold mb-2 font-serif"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-lg text-gray-700 font-serif"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
