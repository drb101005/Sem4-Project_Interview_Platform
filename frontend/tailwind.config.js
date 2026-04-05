/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d1b2a",
        slate: "#415a77",
        mist: "#e0e1dd",
        sand: "#f8f5ee",
        accent: "#ff6b35",
      },
    },
  },
  plugins: [],
};
