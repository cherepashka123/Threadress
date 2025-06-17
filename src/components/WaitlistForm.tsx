'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative py-24 overflow-hidden bg-white">
      {/* Tech-inspired background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-violet-600/5 to-indigo-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-indigo-600/5 to-violet-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '120%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -left-[10%] top-[50%] h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"
            />
            <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900">
              Join the Future of Fashion
            </h2>
          </div>
          <p className="text-neutral-600 font-light max-w-xl mx-auto">
            Sign up to get early access to our local fashion discovery platform
          </p>
        </motion.div>

        {/* Form container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
            {/* Tech pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Animated border */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 border border-indigo-500/20 rounded-2xl"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Form content */}
            <div className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 z-20"
                      required
                    />
                    <motion.div
                      className="absolute inset-0 border border-indigo-500/0 rounded-lg pointer-events-none"
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-400 text-white py-3 px-6 rounded-lg relative overflow-hidden group font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                  <span className="relative z-10">Join Waitlist</span>
                </motion.button>
              </form>

              {/* Progress indicator */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-600">Waitlist Progress</span>
                  <span className="text-indigo-600">75% Full</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Limited spots available for beta launch
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
              title: 'Early Access',
              description: 'Be the first to experience our platform',
            },
            {
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ),
              title: 'Exclusive Benefits',
              description: 'Special perks for early adopters',
            },
            {
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              title: 'Priority Access',
              description: 'Skip the line when we launch',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-neutral-100 relative overflow-hidden group hover:border-indigo-200 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 text-sm font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
