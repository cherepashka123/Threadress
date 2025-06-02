// src/components/Navbar.tsx
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 bg-white shadow-md">
      {/* Left: Logo/Brand */}
      <div className="text-2xl font-bold">
        <Link href="/">Threadress</Link>
      </div>

      {/* Center: Primary links (hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex flex-none space-x-6">
        <Link href="/browse" className="hover:text-indigo-600">
          Browse
        </Link>
        <Link href="/cart" className="hover:text-indigo-600">
          Cart
        </Link>
        {/* New Map link */}
        <Link href="/map" className="hover:text-indigo-600">
          Find Boutiques
        </Link>
        <Link href="#features" className="hover:text-indigo-600">
          Features
        </Link>
        <Link href="#how-it-works" className="hover:text-indigo-600">
          How It Works
        </Link>
        <Link href="#demo" className="hover:text-indigo-600">
          Demo
        </Link>
        <Link href="#contact" className="hover:text-indigo-600">
          Contact
        </Link>
      </div>

      {/* Right: “Join Waitlist” + Mobile menu */}
      <div className="flex-none flex items-center space-x-4">
        {/* Join Waitlist button */}
        <Link
          href="#waitlist"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Join Waitlist
        </Link>

        {/* Mobile dropdown (shown only on < lg) */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-white rounded-box w-52 mt-3"
          >
            <li>
              <Link href="/browse">Browse</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
            <li>
              <Link href="/map">Find Boutiques</Link>
            </li>
            <li>
              <Link href="#features">Features</Link>
            </li>
            <li>
              <Link href="#how-it-works">How It Works</Link>
            </li>
            <li>
              <Link href="#demo">Demo</Link>
            </li>
            <li>
              <Link href="#contact">Contact</Link>
            </li>
            <li className="mt-2">
              <Link href="#waitlist" className="btn btn-primary btn-sm w-full">
                Join Waitlist
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
