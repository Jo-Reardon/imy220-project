/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
    "./frontend/public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-dark': '#0B0F2B',
        'space-blue': '#0FF6FC',
        'nebula-purple': '#A259FF',
        'stellar-orange': '#FF9A3C',
        'solar-red': '#FF4B5C',
        'deep-space': '#0F1432',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}