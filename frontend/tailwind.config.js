/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dna: {
          A: '#00ff88',
          T: '#ff6b6b',
          G: '#4dabf7',
          C: '#ffd43b'
        }
      }
    },
  },
  plugins: [],
}
