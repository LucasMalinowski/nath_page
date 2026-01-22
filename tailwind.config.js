/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf8f5',
          100: '#f5f2ec',
          200: '#e8e2d5',
          300: '#d9d0bd',
          400: '#c9bda5',
          500: '#b8aa8d',
          600: '#a89675',
          700: '#8a7a5d',
          800: '#6b5e47',
          900: '#4d4332',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e6e3',
          200: '#c7ccc7',
          300: '#a8b0a8',
          400: '#8a948a',
          500: '#6d786d',
          600: '#5a635a',
          700: '#484f48',
          800: '#363b36',
          900: '#242724',
        },
        coral: {
          50: '#fef5f3',
          100: '#fce8e3',
          200: '#f9d1c7',
          300: '#f5b9ab',
          400: '#f2a18f',
          500: '#ee8973',
          600: '#e86d52',
          700: '#d85438',
          800: '#b4442d',
          900: '#8f3523',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
