/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../../packages/ui/**/*.{html,js,svelte,ts}', './src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
