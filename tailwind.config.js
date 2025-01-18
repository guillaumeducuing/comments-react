/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}" // C'est ici que Tailwind cherchera les classes utilisées dans tes fichiers React
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
