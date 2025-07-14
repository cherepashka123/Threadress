'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const missionText = `Our mission is to build the local on-demand e-commerce marketplace, creating a synergy between online and offline retail. We help small businesses grow and offer more affordable convenience and value to customers by tackling friction points in brand discovery and payment. Threadress connects customers with nearby boutique fashion stores, giving those stores a new digital channel for discovery. Our platform shows clothing stores based on zip code and evolves into a personalized feed driven by user preferences and order history. Users can search by apparel type, color, or texture, with real-time inventory synced via Square's API. Customers add items to their cart, complete in-app checkout, and pick up in-store within an hour, with optional contactless payment for faster fulfillment and no shipping costs.`;

export default function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    let timeout: NodeJS.Timeout;
    function type() {
      setDisplayed(missionText.slice(0, i));
      if (i < missionText.length) {
        i++;
        timeout = setTimeout(type, 2); // even quicker typing
      }
    }
    type();
    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <section ref={ref} className="relative min-h-[60vh] py-16 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-light mb-8 text-purple-700 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Our Vision
        </h2>
        <div className="mb-8">
          <p
            className="text-lg md:text-xl text-gray-800 leading-relaxed font-serif"
            style={{ fontFamily: 'Playfair Display, serif', minHeight: 180 }}
          >
            {displayed}
            <span
              className="inline-block w-2 h-6 align-middle bg-purple-200 animate-pulse ml-1"
              style={{
                visibility:
                  displayed.length < missionText.length ? 'visible' : 'hidden',
              }}
            />
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-7 py-3 border border-purple-300 text-purple-700 rounded-full font-serif bg-white hover:bg-purple-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Discover Boutiques
          </button>
          <button
            className="px-7 py-3 border border-gray-300 text-gray-700 rounded-full font-serif bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Join Beta
          </button>
        </div>
      </div>
    </section>
  );
}
