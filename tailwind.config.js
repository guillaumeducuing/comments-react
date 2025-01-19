/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "inter-bold": ["Inter-Bold"],
        "inter-regular": ["Inter-Regular"],
        "grotesk-variable": ["Grotesk-Variable"]
      },
      fontSize: {
        xsm: "0.70rem"
      }
    }
  },
  plugins: []
};
