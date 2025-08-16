/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <- enable dark mode via .dark on <html>
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // make sure this matches your src paths
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
