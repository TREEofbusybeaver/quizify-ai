/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Nunito Sans is the default 'sans-serif' font for the whole app
      'sans': ['"Nunito Sans"', 'sans-serif'], 
      // Audiowide is the special 'display' font for titles and logos
      'display': ['Audiowide', 'cursive'],
      },
      // We are adding the custom colors and effects from the Emergent AI theme
      colors: {
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'neon-purple': '#8b5cf6',
        'neon-blue': '#0080ff',
        'dark-bg': '#0a0a0f',
        'darker-bg': '#050508',
      },
      boxShadow: {
        'glow-cyan': '0 0 5px #00FFFF, 0 0 15px #00FFFF, 0 0 25px #00FFFF',
        'glow-magenta': '0 0 5px #FF00FF, 0 0 15px #FF00FF, 0 0 25px #FF00FF',
      },
      dropShadow: {
        'glow-cyan': [
          '0 0 7px rgba(0, 255, 255, 0.8)',
          '0 0 15px rgba(0, 255, 255, 0.6)'
        ],
        'glow-magenta': [
          '0 0 7px rgba(255, 0, 255, 0.8)',
          '0 0 15px rgba(255, 0, 255, 0.6)'
        ]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // We are adding the required plugin
  plugins: [require("tailwindcss-animate")],
}