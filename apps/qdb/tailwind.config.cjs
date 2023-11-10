/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../packages/ui/**/*.{html,js,svelte,ts}',
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['neue-montreal', 'sans-serif'],
        serif: ['migra-italic', 'serif'],
      },
      colors: {
        brand: {
          peach: '#fff5eb',
          green: '#00b06b',
          red: '#ce323a',
        },
      },
    },
  },
  plugins: [],
}
