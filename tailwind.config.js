/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Space-themed color palette for CodeVerse
        space: {
          dark: '#0a0a0f',
          medium: '#1a1a2e',
          light: '#16213e',
          accent: '#0f3460',
          blue: '#4fc3f7',
          purple: '#9c27b0',
          orange: '#ff9800',
          pink: '#e91e63',
        },
        cosmic: {
          nebula: '#2d1b69',
          star: '#ffd700',
          plasma: '#00bcd4',
          blue: '#4fc3f7',
          void: '#0d1117',
          orange: '#ff9800', // ✅ Added
          pink: '#e91e63',   // ✅ Added
        }
      },
      scale: {
        102: '1.02', // ✅ Adds support for hover:scale-102
      },
      fontFamily: {
        space: ['Orbitron', 'monospace'],
        cosmic: ['Exo 2', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        'nebula-gradient': 'linear-gradient(45deg, #2d1b69 0%, #0f3460 100%)',
        'cosmic-gradient': 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)',
      },
      backdropBlur: {
        cosmic: '8px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(79, 195, 247, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(79, 195, 247, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
