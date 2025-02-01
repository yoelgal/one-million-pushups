/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // blue-600
        secondary: "#475569", // slate-600
        accent: "#dc2626", // red-600
      },
    },
  },
  plugins: [],
};
