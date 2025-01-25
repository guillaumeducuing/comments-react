/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "inter-regular": ["Inter", "sans-serif"],
        dm: ["DM Sans", "serif"]
      },
      fontSize: {
        xsm: "0.70rem"
      }
    }
  },
  plugins: []
};
