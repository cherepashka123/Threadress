// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between py-4 px-4 md:py-6 md:px-8 bg-[#fafafa] hover:bg-white transition-all duration-300">
      {/* Left: Logo/Brand */}
      <div className="text-xl md:text-2xl font-bold">
        <Link
          href="/"
          className="text-neutral-900 hover:text-neutral-800 transition-colors"
        >
          Threadress
        </Link>
      </div>

      {/* Center: Primary links (hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex flex-none space-x-6">
        <Link
          href="/browse"
          className="text-neutral-900 hover:text-indigo-600 transition-colors"
        >
          Browse
        </Link>
        <Link
          href="/cart"
          className="text-neutral-900 hover:text-indigo-600 transition-colors"
        >
          Cart
        </Link>
        <Link
          href="/map"
          className="text-neutral-900 hover:text-indigo-600 transition-colors"
        >
          Find Boutiques
        </Link>
        <Link
          href="/smart-search"
          className="text-neutral-900 hover:text-indigo-600 transition-colors"
        >
          Smart Search
        </Link>
      </div>

      {/* Right: "Join Waitlist" + Mobile menu */}
      <div className="flex items-center gap-4">
        <Link
          href="#waitlist"
          className="inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-900 text-white text-sm sm:text-base rounded-lg hover:bg-neutral-800 transition-all"
        >
          Join Waitlist
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="text-lg font-medium">Menu</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/browse"
                      className="px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Browse
                    </Link>
                    <Link
                      href="/cart"
                      className="px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cart
                    </Link>
                    <Link
                      href="/map"
                      className="px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Find Boutiques
                    </Link>
                    <Link
                      href="/smart-search"
                      className="px-4 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Smart Search
                    </Link>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
