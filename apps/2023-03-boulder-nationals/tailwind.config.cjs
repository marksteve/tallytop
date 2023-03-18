/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../../packages/ui/**/*.{html,js,svelte,ts}', './src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        brand: '#003070'
      },
      fontFamily: {
        sans: ['glacial-indifference', 'sans-serif']
      }
    }
  },
  plugins: []
}
