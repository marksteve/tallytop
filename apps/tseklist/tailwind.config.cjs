/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans'],
        serif: ['Instrument Serif']
      },
      colors: {
        fg: '#351f59',
        primary: '#ac6dc1',
        secondary: '#7492b5'
      }
    }
  },
  plugins: []
};
