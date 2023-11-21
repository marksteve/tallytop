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
        tanker: ['Tanker', 'sans-serif'],
        supreme: ['Supreme', 'sans-serif'],
      },
      colors: {
        brand: {
          peach: '#fef6ec',
          yellow: '#e8aa3e',
          green: '#07ae71',
          red: '#ca3f43',
        },
      },
    },
  },
  plugins: [],
}
