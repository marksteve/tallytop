/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Futura', 'Inter', 'sans-serif']
      },
      colors: {
        fg: '#351F59'
      }
    },
  },
  plugins: [],
}
