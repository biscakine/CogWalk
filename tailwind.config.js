/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{css,xml,html,vue,svelte,ts,tsx}'
  ],
  darkMode: ['class', '.ns-dark'],
  theme: {
    extend: {
      colors: {
        'cogwalk': {
          primary: '#1a3b3b',    // Dark teal
          secondary: '#40e0d0',  // Turquoise
          accent: '#2c5c5c',     // Medium teal
          light: '#f5f5f5',      // Light background
          text: '#1a3b3b'        // Text color
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}