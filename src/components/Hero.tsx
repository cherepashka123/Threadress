// src/components/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Typing animation for a single word
function TypingWord({ word }: { word: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      setDisplayed(word.slice(0, i + 1));
      i++;
      if (i === word.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [word]);
  return (
    <span className="italic">
      {displayed}
      <span
        className={`inline-block w-2 h-7 align-middle ml-1 ${done ? 'opacity-0' : 'bg-black animate-pulse'}`}
        style={{ verticalAlign: 'middle' }}
      />
    </span>
  );
}

export default function Hero() {
  return (
    <>
      <section
        className="relative bg-white min-h-0 flex items-start justify-center overflow-visible pt-0 pb-0 mb-0"
        style={{
          paddingTop: 0,
          marginTop: 0,
          paddingBottom: 0,
          marginBottom: 0,
        }}
      >
        <div
          className="w-full mx-auto px-4 md:px-6"
          style={{ paddingBottom: 0, marginBottom: 0 }}
        >
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center mt-[-400px] mb-[-260px]">
            {/* Text content */}
            <motion.div
              className="text-center lg:text-left space-y-4 flex flex-col justify-center mt-[-24px] lg:pl-24 mb-0 pb-0"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-2 max-w-2xl mx-auto text-left">
                <motion.h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 leading-[1.05] font-serif text-left"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <span className="block">Discover</span>
                  <span className="block">Local Fashion,</span>
                  <span className="block">
                    <TypingWord word="Reimagined" />
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl sm:text-2xl text-gray-700 max-w-2xl leading-relaxed font-serif text-left"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  AI-curated local inventory – reserve online, pick up today in
                  store.
                </motion.p>

                {/* Demo Video (local, no controls, no overlays) - placed under subheading */}
                <div className="w-full flex justify-start mt-8">
                  <video
                    src="/demo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-2xl shadow-lg max-w-2xl w-full object-cover"
                    style={{
                      background: 'white',
                      aspectRatio: '16/9',
                      border: 'none',
                    }}
                  />
                </div>
              </div>

              <motion.div
                className="flex flex-col items-center justify-center gap-3 mt-6"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.a
                  href="#waitlist"
                  className="px-8 py-3 border border-gray-300 text-black rounded-full font-serif bg-white hover:bg-gray-50 transition-colors duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-lg cursor-pointer"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join the Waitlist
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Single Large Mockup */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ marginBottom: 0, paddingBottom: 0 }}
            >
              <div className="relative w-[1200px] sm:w-[1600px] md:w-[2100px] lg:w-[2700px] xl:w-[3400px] aspect-[9/19.5]">
                <motion.img
                  src="/Mockup_1.png"
                  alt="Threadress app mockup"
                  className="w-full h-full object-contain"
                  style={{
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
