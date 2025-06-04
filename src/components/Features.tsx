// src/components/Features.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const features = [
    {
      title: 'Real-Time Inventory',
      description:
        'View live boutique stock levels instantly. No more wasted trips or guesswork.',
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
        'One-click payments and flexible terms. Checkout in seconds.',
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
        'Discover eco-innovative boutiques. Shop smart, reduce waste, support green.',
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
        'Our AI engine suggests sizes and styles based on your profile. No more returns.',
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
      gradient: 'from-pink-500 to-rose-500',
      accent: 'pink',
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
      className="relative py-32 bg-[#f4efe9] overflow-hidden"
    >
      {/* Fashion-forward background elements */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#8b6f5f08_0%,transparent_50%)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Flowing curves */}
          <svg
            className="absolute w-full h-full opacity-[0.03]"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
          >
            <motion.path
              d="M0,500 Q250,400 500,500 T1000,500"
              fill="none"
              stroke="#8b6f5f"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            <motion.path
              d="M0,400 Q250,500 500,400 T1000,400"
              fill="none"
              stroke="#8b6f5f"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            <motion.path
              d="M0,600 Q250,500 500,600 T1000,600"
              fill="none"
              stroke="#8b6f5f"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </svg>

          {/* Floating fashion elements */}
          <motion.div
            className="absolute top-20 left-[20%] w-32 h-32 rounded-full"
            style={{
              background:
                'radial-gradient(circle at center, #8b6f5f05, transparent 70%)',
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute bottom-40 right-[30%] w-40 h-40 rounded-full"
            style={{
              background:
                'radial-gradient(circle at center, #8b6f5f03, transparent 70%)',
            }}
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1,
            }}
          />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '140%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -left-[20%] top-[50%] h-px bg-gradient-to-r from-transparent via-[#8b6f5f]/30 to-transparent"
            />
            <h2
              className="
              text-4xl
              font-[500]
              text-[#8b6f5f]
              tracking-[-0.01em]
              mb-4
              px-12
            "
            >
              Key Features
            </h2>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -right-3 -top-3 w-8 h-8 border-2 border-[#8b6f5f]/20 rounded-full"
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -left-5 -bottom-5 w-6 h-6 border border-[#8b6f5f]/20 rounded-full"
            />
          </div>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
              className="group relative"
            >
              <div
                className="
                relative
                p-8
                bg-white/80
                backdrop-blur-sm
                rounded-2xl
                transition-all
                duration-500
                hover:shadow-[0_8px_40px_-12px_rgba(139,111,95,0.12)]
                border border-[#8b6f5f]/10
                hover:border-transparent
                h-full
                overflow-hidden
              "
              >
                {/* Decorative elements */}
                <motion.div
                  className={`
                    absolute -right-12 -top-12 w-24 h-24 
                    bg-gradient-to-br ${feature.gradient} opacity-[0.07]
                    rounded-full blur-xl
                    transition-transform duration-700
                    group-hover:scale-150
                  `}
                />

                {/* Icon with gradient background */}
                <div
                  className={`
                  relative
                  inline-flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-xl
                  bg-gradient-to-r ${feature.gradient}
                  text-white
                  shadow-sm
                  mb-6
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-[12deg]
                  group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]
                `}
                >
                  {feature.icon}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    whileHover={{ scale: 1.2, opacity: 0 }}
                  />
                </div>

                {/* Title with animated accent */}
                <div className="relative">
                  <h3
                    className="
                    text-lg
                    font-[500]
                    text-gray-900
                    mb-3
                    tracking-[-0.005em]
                    transition-colors
                    duration-300
                  "
                  >
                    {feature.title}
                  </h3>
                  <motion.div
                    className={`
                      absolute
                      -left-2
                      top-[50%]
                      w-0.5
                      h-0
                      bg-${feature.accent}-500/30
                      transition-all
                      duration-300
                      group-hover:h-[120%]
                      group-hover:-top-[10%]
                    `}
                  />
                </div>

                {/* Description */}
                <p
                  className="
                  text-sm
                  font-[400]
                  text-gray-600
                  leading-relaxed
                  tracking-[0]
                  transition-colors
                  duration-300
                  group-hover:text-gray-900
                "
                >
                  {feature.description}
                </p>

                {/* Interactive hover line */}
                <motion.div
                  className={`
                    absolute
                    bottom-0
                    left-[5%]
                    right-[95%]
                    h-[2px]
                    bg-gradient-to-r ${feature.gradient}
                    opacity-0
                    transition-all
                    duration-700
                    ease-out
                    group-hover:right-[5%]
                    group-hover:opacity-30
                  `}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
