// src/components/Search.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { items, Item } from '@/data/items';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search() {
  const [q, setQ] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = items.filter((item) =>
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  // Handle click outside to blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto relative"
    >
      {/* Search input with animated focus ring */}
      <div className="relative text-gray-600 mb-6">
        <motion.div
          className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 blur-md transition-all duration-300"
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search items..."
          className="
            w-full 
            h-12 
            px-6
            py-2 
            pr-12 
            rounded-full 
            border border-gray-200
            bg-white/80
            backdrop-blur-sm
            shadow-sm 
            focus:outline-none 
            focus:border-transparent
            placeholder-gray-400
            transition-all
            duration-300
            relative
            z-10
          "
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            absolute 
            right-3 
            top-0 
            bottom-0 
            flex 
            items-center 
            justify-center 
            text-gray-400
            hover:text-gray-600
            transition-colors
            duration-300
            z-10
          "
        >
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
              d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1010 3a7 7 0 006.65 13.65z"
            />
          </svg>
        </motion.button>
      </div>

      {/* Animated Results list */}
      <AnimatePresence mode="wait">
        <motion.ul layout className="space-y-4">
          {results.map((item: Item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card with glass effect */}
              <div
                className="
                relative 
                bg-white/60
                backdrop-blur-xl
                rounded-2xl 
                p-4 
                flex 
                items-center 
                border border-white/40
                transition-all 
                duration-300
                hover:border-transparent
                hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]
                overflow-hidden
              "
              >
                {/* Gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-100/50 to-indigo-100/50 opacity-0 transition-opacity duration-300"
                  animate={{
                    opacity: isFocused ? 0.5 : 0,
                  }}
                />

                {/* Image thumbnail with hover effect */}
                <motion.div
                  className="w-16 h-16 relative flex-shrink-0 rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Textual info */}
                <div className="ml-4 flex-1 relative z-10">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <motion.p
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-medium"
                    whileHover={{ scale: 1.02 }}
                  >
                    ${item.price.toFixed(2)}
                  </motion.p>
                </div>
              </div>
            </motion.li>
          ))}

          {/* Animated "No results" fallback */}
          {results.length === 0 && (
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="
                text-center 
                text-gray-500 
                py-8
                px-4
                rounded-2xl
                bg-white/60
                backdrop-blur-xl
                border border-white/40
              "
            >
              No items found.
            </motion.li>
          )}
        </motion.ul>
      </AnimatePresence>
    </motion.div>
  );
}
