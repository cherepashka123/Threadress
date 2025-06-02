// src/components/HowItWorks.tsx
'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Browse Local Inventory',
    description:
      'Instally see what’s in stock at nearby boutiques—no guesswork, ever.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8b6f5f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    title: 'One-Click Checkout',
    description:
      'Complete your purchase in a flash, reserve items for pickup, and skip lines.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8b6f5f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7h18M3 11h18M5 15h.01M9 15h.01M13 15h.01M17 15h.01M21 15H3m0-8v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Try & Enjoy',
    description:
      'Pick up your order, try on in-store, and return if it doesn’t fit—no extra fees.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8b6f5f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V4H8v7M5 11h14l-1.34 12.66a2 2 0 01-1.98 1.74H8.32a2 2 0 01-1.98-1.74L5 11z"
        />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#f9f5f0]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-4xl font-heading font-bold text-center text-neutral-900 mb-12 tracking-tight">
          How It Works
        </h2>

        {/* Animated Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              className="relative bg-white rounded-3xl p-8 overflow-hidden group"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              {/* Subtle Pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('/patterns/hexgrid.svg')]"></div>

              {/* Icon Circle */}
              <div className="relative z-10 mb-6 flex justify-center">
                <div className="bg-[#e0d7ca] p-4 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
              </div>

              {/* Heading with underline animation */}
              <h3 className="relative z-10 text-xl font-semibold text-neutral-900 mb-4 flex flex-col items-center">
                {step.title}
                <span className="block h-1 w-0 bg-[#8b6f5f] mt-2 transition-all duration-300 group-hover:w-1/2"></span>
              </h3>

              {/* Description */}
              <p className="relative z-10 text-neutral-600 leading-relaxed text-center">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
