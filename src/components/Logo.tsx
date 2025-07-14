// src/components/Logo.tsx
'use client';

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Threadress Logo"
    >
      {/* Thread-like T */}
      <path
        d="M 8 10 Q 20 10 32 10"
        stroke="#222"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 20 10 Q 20 25 28 32"
        stroke="#222"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
