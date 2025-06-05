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
      gradient: 'from-violet-600 to-indigo-600',
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
      gradient: 'from-violet-600 to-indigo-600',
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
      gradient: 'from-violet-600 to-indigo-600',
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
      gradient: 'from-violet-600 to-indigo-600',
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
      className="relative py-24 bg-gradient-to-b from-[#fafafa] to-white overflow-hidden"
    >
      {/* Minimalist background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Subtle gradient orbs */}
          <motion.div
            className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/5 to-indigo-600/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/5 to-violet-600/5 rounded-full blur-3xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
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

        {/* Subtle flow animation for the entire section */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={false}
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative w-full"
            >
              <div className="relative p-8 bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm h-full">
                {/* Feature icon */}
                <div
                  className={`
                    relative inline-flex items-center justify-center
                    w-12 h-12 rounded-xl mb-6
                    bg-gradient-to-r ${feature.gradient}
                    text-white
                    group-hover:scale-110 transition-transform duration-300
                  `}
                >
                  {feature.icon}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    whileHover={{ scale: 1.2, opacity: 0 }}
                  />
                </div>

                {/* Feature content */}
                <h3 className="text-xl font-light text-neutral-900 mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 font-light leading-relaxed group-hover:translate-x-1 transition-transform duration-300 delay-75">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    background: `linear-gradient(90deg, var(--violet-600), var(--indigo-600))`,
                    padding: '1px',
                  }}
                >
                  <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl" />
                </motion.div>

                {/* Individual feature flow animation */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
                  initial={false}
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.02) 0%, transparent 50%)',
                      'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5,
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
