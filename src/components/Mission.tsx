'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function Mission() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    mouseX.set(x);
    mouseY.set(y);
  };

  const words = [
    'Local Retail',
    'On-Demand',
    'Personalized',
    'Contactless',
    'Connected',
  ];

  // Floating particles with client-side rendering
  const FloatingParticles = () => {
    if (!isClient) return null;

    return (
      <>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-200 rounded-full"
            animate={{
              x: [
                Math.random() *
                  (typeof window !== 'undefined' ? window.innerWidth : 1000),
                Math.random() *
                  (typeof window !== 'undefined' ? window.innerWidth : 1000),
              ],
              y: [
                Math.random() *
                  (typeof window !== 'undefined' ? window.innerHeight : 1000),
                Math.random() *
                  (typeof window !== 'undefined' ? window.innerHeight : 1000),
              ],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </>
    );
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[60vh] py-12 overflow-hidden bg-white"
    >
      {/* Interactive background gradient */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(120, 119, 198, 0.1), transparent 40%)`,
        }}
      />

      {/* Animated grid pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Tech words flow */}
          <div className="relative h-12 mb-6">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {words.map((word, index) => (
                <motion.div
                  key={word}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.5],
                    y: [-20, 0, 0, 20],
                  }}
                  transition={{
                    duration: 4,
                    delay: index * 0.8,
                    repeat: Infinity,
                    repeatDelay: words.length * 0.8,
                  }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 text-lg font-light">
                    {word}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mission Title */}
          <div className="relative inline-block mb-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '120%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -left-[10%] top-[50%] h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"
            />
            <motion.h2
              className="text-4xl font-[500] tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Vision
            </motion.h2>
          </div>

          {/* Mission Content */}
          <div className="max-w-4xl mx-auto relative px-4 md:px-0">
            {/* Interactive card */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white rounded-2xl p-6 md:p-10 lg:p-12 shadow-lg border border-neutral-100"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-base md:text-lg text-gray-600 leading-relaxed md:leading-relaxed"
              >
                Our mission is to build the local on-demand e-commerce
                marketplace, creating a synergy between online and offline
                retail. We help small businesses grow and offer more affordable
                convenience and value to customers by tackling friction points
                in brand discovery and payment. Threadress connects customers
                with nearby boutique fashion stores, giving those stores a new
                digital channel for discovery. Our platform shows clothing
                stores based on zip code and evolves into a personalized feed
                driven by user preferences and order history. Users can search
                by apparel type, color, or texture, with real-time inventory
                synced via Square's API. Customers add items to their cart,
                complete in-app checkout, and pick up in-store within an hour,
                with optional contactless payment for faster fulfillment and no
                shipping costs.
              </motion.p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -left-6 -top-6 w-12 h-12">
              <motion.div
                className="w-full h-full rounded-full border border-purple-200"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <div className="absolute -right-3 -bottom-3 w-6 h-6">
              <motion.div
                className="w-full h-full rounded-full border border-purple-200"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>

          {/* Interactive CTAs */}
          <motion.div
            className="mt-8 md:mt-10 flex flex-col md:flex-row justify-center gap-3 px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/map">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-600 text-white rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Discover Boutiques
              </motion.button>
            </Link>
            <Link href="#waitlist">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-white text-gray-800 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                Join Beta
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
