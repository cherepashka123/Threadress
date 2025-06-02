// src/components/SignupForm.tsx
'use client';

import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Signup email:', email);
    setEmail('');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-center mb-4">
        Get Early Access
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Polished input */}
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full
            px-4 
            py-3 
            border 
            border-neutral-300 
            rounded-full 
            text-neutral-900 
            placeholder-neutral-500 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
            transition 
            duration-200
          "
        />

        {/* Polished Join Waitlist button */}
        <button
          type="submit"
          className="
            w-full
            px-6 
            py-3 
            bg-gradient-to-r from-indigo-600 to-purple-600 
            text-white 
            font-semibold 
            rounded-full 
            shadow-lg 
            hover:from-indigo-700 hover:to-purple-700 
            transform 
            hover:scale-105 
            transition 
            duration-300
            focus:outline-none focus:ring-4 focus:ring-purple-300
          "
        >
          Join Waitlist
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 mt-4">
        We respect your privacy. No spam, ever.
      </p>
    </div>
  );
}
