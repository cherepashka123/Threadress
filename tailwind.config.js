// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#F5F5FF',
          DEFAULT: '#4F46E5',
          dark: '#3730A3',
        },
        accent: {
          light: '#22D3EE',
          DEFAULT: '#06B6D4',
          dark: '#0891B2',
        },
        neutral: {
          100: '#F9FAFB',
          200: '#F3F4F6',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  darkMode: 'media',
  plugins: [
    // No daisyui here—just remove it entirely
  ],
};
