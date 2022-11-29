/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['Oleo Script', 'cursive'],
        input: ['Dekko', 'sans-serif'],
        mono: ['Roboto Mono, monospace'],
        sans: ['CS Gordon Rounded', 'sans-serif'],
      },
      colors: {
        red: '#cf2539',
        teal: '#a2c4bc',
        yellow: '#fbeb98',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
