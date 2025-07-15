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
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2
          className="text-4xl md:text-5xl font-light text-gray-900 mb-8 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Join the Waitlist
        </h2>
        <p
          className="text-lg text-gray-500 mb-8 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Become part of the Threadress community and be the first to hear about
          exclusive launches, events, and insider updates.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            className="flex-1 px-6 py-3 border border-gray-300 rounded-full text-lg font-serif"
            style={{ fontFamily: 'Playfair Display, serif' }}
            placeholder="Your email"
          />
          <button
            type="submit"
            className="px-8 py-3 border border-purple-300 text-purple-700 rounded-full font-serif bg-white hover:bg-purple-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Join
          </button>
        </form>
      </div>
    </section>
  );
}
