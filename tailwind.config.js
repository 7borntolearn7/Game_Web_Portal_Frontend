/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        icomoon: ["icomoon", "sans-serif"],
      },
      colors: {
        "custom-purple": "#a61f67",
      },
    },
  },
  plugins: [],
};
