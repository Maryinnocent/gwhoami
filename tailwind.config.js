/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: { 
        'dodge-b': '#1e90ff',
        'dodge-d': '#0382ff',
        'sky-b': '#00AEF0'
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: "scale(.95)" } },
        fadeOut: { to: { opacity: 0, transform: "scale(.95)" } }
      },
      animation: {
        fadeIn: "fadeIn 0.1s ease-out",
        fadeOut: "fadeOut 0.15s ease-out forwards"
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
