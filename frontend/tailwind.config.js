/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7B1C2E',
          50: '#FAF0F2',
          100: '#F5E0E4',
          200: '#E8B3BC',
          300: '#D97F90',
          400: '#C84D62',
          500: '#7B1C2E',
          600: '#621626',
          700: '#49101C',
          800: '#300A12',
          900: '#180509',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96A',
          dark: '#A8872E',
        },
        charcoal: {
          DEFAULT: '#1A1A2E',
          light: '#2D2D44',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
