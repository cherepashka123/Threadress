// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['var(--font-raleway)'],
      },
    },
  },
  plugins: [],
};
