// src/components/SignupForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCheck,
  FaUserFriends,
  FaTshirt,
  FaShoppingBag,
} from 'react-icons/fa';
import { GiDress, GiHighHeel } from 'react-icons/gi';

// Fashion item icons array
const fashionIcons = [
  { icon: FaTshirt, color: '#6366f1' },
  { icon: GiDress, color: '#8b5cf6' },
  { icon: FaShoppingBag, color: '#6366f1' },
  { icon: GiHighHeel, color: '#8b5cf6' },
];

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(250); // Default initial value

  // Generate random number after component mounts
  useEffect(() => {
    setWaitlistCount(Math.floor(Math.random() * 100) + 250);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitted(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Signup email:', email);
    // Keep the success state for a moment before resetting
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  }

  return (
    <section className="relative bg-[#fafafa] py-24 overflow-hidden">
      {/* Tech-inspired background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            Join the Waitlist
          </h2>
          <p className="text-neutral-600 font-light">
            Be the first to experience the future of local fashion discovery
          </p>
        </motion.div>

        {/* Form content with matching style */}
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-white rounded-xl p-6 border border-neutral-100"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-violet-100 rounded-full blur-3xl opacity-60 -z-10" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full blur-3xl opacity-60 -z-10" />

            {/* Form container with glass effect */}
            <motion.div
              className="backdrop-blur-sm bg-white/90 p-8 rounded-2xl shadow-lg border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h3
                className="text-2xl font-semibold text-center mb-2 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Get Early Access
              </motion.h3>

              {/* Social proof section */}
              <motion.div
                className="mb-6 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex -space-x-2 mb-3">
                  {fashionIcons.map((item, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: 'white' }}
                    >
                      <item.icon
                        className="w-4 h-4"
                        style={{ color: item.color }}
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs">
                    +{waitlistCount - fashionIcons.length}
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <FaUserFriends className="text-indigo-600" />
                  <span>{waitlistCount} fashion enthusiasts joined</span>
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email input with animation */}
                <div className="relative">
                  <motion.div
                    className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${
                      isFocused
                        ? 'border-2 border-indigo-600/30'
                        : 'border border-neutral-200'
                    }`}
                    animate={{
                      boxShadow: isFocused
                        ? '0 0 20px rgba(99, 102, 241, 0.2)'
                        : '0 0 0px rgba(99, 102, 241, 0)',
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="
                      w-full
                      px-6 
                      py-4
                      rounded-2xl
                      bg-white/50
                      text-gray-900 
                      placeholder-gray-400
                      relative
                      z-10
                      focus:outline-none
                      transition-all
                      duration-300
                    "
                  />
                </div>

                {/* Submit button with animations */}
                <motion.button
                  type="submit"
                  disabled={isSubmitted}
                  className={`
                    w-full
                    px-6 
                    py-4 
                    rounded-xl
                    font-light 
                    text-white/95
                    relative
                    overflow-hidden
                    ${isSubmitted ? 'bg-neutral-900' : 'bg-neutral-900'}
                    transition-colors
                    duration-300
                    disabled:cursor-not-allowed
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    animate={{
                      opacity: isSubmitted ? 0 : 1,
                    }}
                  />
                  <motion.div className="relative flex items-center justify-center gap-2">
                    {isSubmitted ? (
                      <>
                        <FaCheck className="w-4 h-4" />
                        <span>You're on the list!</span>
                      </>
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <FaArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.div>
                </motion.button>
              </form>

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-sm text-gray-600">
                    Limited spots available
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  We respect your privacy. No spam, ever.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
