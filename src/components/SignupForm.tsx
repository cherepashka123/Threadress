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
  { icon: FaTshirt, color: '#8b6f5f' },
  { icon: GiDress, color: '#d4c4bc' },
  { icon: FaShoppingBag, color: '#8b6f5f' },
  { icon: GiHighHeel, color: '#d4c4bc' },
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
    <div className="relative max-w-md mx-auto">
      {/* Decorative elements */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#d4c4bc]/30 to-purple-100 rounded-full blur-3xl opacity-60 -z-10" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-full blur-3xl opacity-60 -z-10" />

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
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#d4c4bc] flex items-center justify-center text-white text-xs">
              +{waitlistCount - fashionIcons.length}
            </div>
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            <FaUserFriends className="text-[#d4c4bc]" />
            <span>{waitlistCount} fashion enthusiasts joined</span>
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input with animation */}
          <div className="relative">
            <motion.div
              className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${
                isFocused
                  ? 'border-2 border-[#d4c4bc]/30'
                  : 'border border-neutral-200'
              }`}
              animate={{
                boxShadow: isFocused
                  ? '0 0 20px rgba(212, 196, 188, 0.2)'
                  : '0 0 0px rgba(212, 196, 188, 0)',
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
              rounded-2xl
              font-medium 
              text-[#8b6f5f]
              shadow-lg 
              relative
              overflow-hidden
              ${isSubmitted ? 'bg-[#d4c4bc]' : 'bg-[#f4efe9] hover:bg-[#ebe3db]'}
              transition-colors
              duration-300
              disabled:cursor-not-allowed
              border border-[#d4c4bc]/20
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#f4efe9] to-[#ebe3db]"
              initial={false}
              animate={{
                opacity: isSubmitted ? 0 : 1,
              }}
            />

            <motion.div className="relative flex items-center justify-center gap-2">
              {isSubmitted ? (
                <>
                  <FaCheck className="w-4 h-4 text-white" />
                  <span className="text-white">You're on the list!</span>
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
            <p className="text-sm text-gray-600">Limited spots available</p>
          </div>
          <p className="text-xs text-gray-400">
            We respect your privacy. No spam, ever.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
