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
      gradient: 'from-purple-500 to-indigo-500',
      accent: 'purple',
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
      gradient: 'from-fuchsia-500 to-pink-500',
      accent: 'fuchsia',
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
      gradient: 'from-violet-500 to-purple-500',
      accent: 'violet',
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
      gradient: 'from-indigo-500 to-purple-500',
      accent: 'indigo',
    },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#fafafa] overflow-hidden"
    >
      {/* Tech-inspired background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            Key Features
          </h2>
          <p className="text-neutral-600 font-light max-w-xl mx-auto">
            Experience the future of local fashion discovery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-6 bg-white rounded-xl transition-all duration-300 hover:shadow-lg border border-neutral-100">
                {/* Feature icon */}
                <div
                  className={`
                    relative inline-flex items-center justify-center
                    w-10 h-10 rounded-lg mb-4
                    bg-gradient-to-r ${feature.gradient}
                    text-white
                  `}
                >
                  {feature.icon}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    whileHover={{ scale: 1.2, opacity: 0 }}
                  />
                </div>

                {/* Feature content */}
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 font-light text-sm">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(99,102,241,0.03), transparent 70%)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
