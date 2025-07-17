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
    <section
      id="waitlist"
      className="py-24 bg-white"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="text-4xl md:text-5xl font-light text-gray-900 mb-4 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Join the Waitlist
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
          className="text-lg text-gray-500 mb-10 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Become part of the Threadress community and be the first to hear about
          exclusive launches, events, and insider updates.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
          className="flex flex-col gap-3 sm:flex-row sm:gap-2 justify-center items-center w-full max-w-xl mx-auto px-2"
        >
          <input
            className="flex-1 w-full px-5 py-4 border border-gray-200 rounded-full text-lg font-serif bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all shadow-sm placeholder:text-gray-400 mb-2 sm:mb-0"
            style={{ fontFamily: 'Playfair Display, serif' }}
            placeholder="Your email"
          />
          <motion.button
            type="submit"
            whileHover={{ y: -2, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.07)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-serif bg-neutral-900 text-white text-lg font-medium shadow-sm hover:bg-neutral-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-300 border-none"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Join
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
