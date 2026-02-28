/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/@tremor/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        berkeleyBlue: "#002B56",
        springGreen: "#05F283",
        iris: "#5648B7",
        tomato: "#FF5347",
      },
    },
  },
  plugins: [],
}
