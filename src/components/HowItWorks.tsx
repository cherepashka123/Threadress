// src/components/HowItWorks.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    title: 'Browse Local Inventory',
    description:
      "Instantly see what's in stock at nearby boutiques. No guesswork, ever.",
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    gradient: 'from-purple-500 to-indigo-500',
    accent: 'purple',
  },
  {
    title: 'One-Click Checkout',
    description:
      'Complete your purchase in a flash, reserve items for pickup, and skip lines.',
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
    title: 'Try & Enjoy',
    description:
      "Pick up your order, try on in-store, and return if it doesn't fit. No extra fees.",
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
          d="M16 11V4H8v7M5 11h14l-1.34 12.66a2 2 0 01-1.98 1.74H8.32a2 2 0 01-1.98-1.74L5 11z"
        />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-500',
    accent: 'violet',
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, 60]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-[#f4efe9] overflow-hidden"
    >
      {/* Animated background elements */}
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
          </svg>
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
            <h2 className="text-4xl font-[500] text-[#8b6f5f] tracking-[-0.01em] mb-4 px-12">
              How It Works
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
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
                    bg-gradient-to-br ${step.gradient} opacity-[0.07]
                    rounded-full blur-xl
                    transition-transform duration-700
                    group-hover:scale-150
                  `}
                />

                {/* Icon */}
                <div
                  className={`
                  relative
                  inline-flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-xl
                  bg-gradient-to-r ${step.gradient}
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
                  {step.icon}
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
                    text-[#8b6f5f]
                    mb-3
                    tracking-[-0.005em]
                    transition-colors
                    duration-300
                  "
                  >
                    {step.title}
                  </h3>
                  <motion.div
                    className={`
                      absolute
                      -left-2
                      top-[50%]
                      w-0.5
                      h-0
                      bg-${step.accent}-500/30
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
                  text-[#9E8E81]
                  leading-relaxed
                  tracking-[0]
                  transition-colors
                  duration-300
                  group-hover:text-[#8b6f5f]
                "
                >
                  {step.description}
                </p>

                {/* Interactive hover line */}
                <motion.div
                  className={`
                    absolute
                    bottom-0
                    left-[5%]
                    right-[95%]
                    h-[2px]
                    bg-gradient-to-r ${step.gradient}
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
