/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../../packages/ui/**/*.{html,js,svelte,ts}', './src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        roc: {
          black: '#161616',
          hotpink: '#ea32c7',
          yellow: '#fad31a'
        }
      }
    }
  },
  plugins: []
}
