/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'skanky-yellow': '#f7ec0f',
        'skanky-red': '#ed2124',
        'skanky-green': '#68bd45',
      }
    },
  },
  plugins: [],
}


