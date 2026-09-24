/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      gridTemplateColumns: {
        21: "repeat(21,minmax(0,1fr))",
      },
    },
  },

  plugins: [],
};