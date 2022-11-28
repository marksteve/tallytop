/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['CS Gordon Rounded', 'sans-serif'],
        input: ['Dekko', 'sans-serif'],
        cursive: ['Oleo Script', 'cursive'],
      },
      colors: {
        teal: '#a2c4bc',
        red: '#cf2539',
        yellow: '#fbeb98',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
