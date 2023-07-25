/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../../packages/ui/**/*.{html,js,svelte,ts}', './src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bagel Fat One', 'sans-serif'],
      },
      colors: {
        rockamanila: {
          bg: '#FAE8DF',
          green: '#0F6A5D',
          orange: '#F99A6D',
          magenta: '#D20D55',
        },
      },
    },
  },
  plugins: [],
}
