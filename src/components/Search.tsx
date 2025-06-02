// src/components/Search.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { items, Item } from '@/data/items';

export default function Search() {
  const [q, setQ] = useState('');
  const results = items.filter((item) =>
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto">
      {/* 1. Search input with icon */}
      <div className="relative text-gray-600 mb-6">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search items..."
          className="
            w-full 
            h-12 
            px-4 
            py-2 
            pr-12 
            rounded-full 
            border border-neutral-300 
            bg-white 
            shadow-sm 
            focus:outline-none 
            focus:ring-2 focus:ring-indigo-500
            placeholder-neutral-400
          "
        />
        <button
          type="button"
          className="
            absolute 
            right-3 
            top-0 
            bottom-0 
            flex 
            items-center 
            justify-center 
            text-gray-500 
            hover:text-gray-700
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1010 3a7 7 0 006.65 13.65z"
            />
          </svg>
        </button>
      </div>

      {/* 2. Results list */}
      <ul className="space-y-4">
        {results.map((item: Item) => (
          <li
            key={item.id}
            className="
              bg-white 
              rounded-2xl 
              shadow-lg 
              p-4 
              flex 
              items-center 
              hover:shadow-xl 
              transition-shadow 
              duration-200
            "
          >
            {/* Image thumbnail */}
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            {/* Textual info */}
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-neutral-900">
                {item.name}
              </h3>
              {/* <p className="text-neutral-600">{item.storeName}</p> */}
              <p className="text-indigo-600 font-medium">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </li>
        ))}

        {/* 3. “No results” fallback */}
        {results.length === 0 && (
          <li className="text-center text-neutral-500 py-4">No items found.</li>
        )}
      </ul>
    </div>
  );
}
