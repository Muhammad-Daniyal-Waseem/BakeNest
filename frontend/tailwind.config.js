/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens:{
      'xs': '500px',
      'sm': '700px',
      'lg': '1024px'
    }
  },
  plugins: [],
}