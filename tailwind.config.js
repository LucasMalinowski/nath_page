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
        // Neutros (base do site)
        'off-white': '#F6F2ED',
        'warm-beige': '#DED6CC',
        
        // Cores principais
        'olive-green': '#5E6F64',
        'sage-green': '#7A8F7A',
        
        // Cores de apoio/acento
        'soft-terracotta': '#C47A5A',
        'coffee-brown': '#4B3A2F',
        'graphite': '#2E2E2E',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Desktop sizes
        'hero': ['56px', { lineHeight: '1.2' }],
        'h1': ['56px', { lineHeight: '1.2' }],
        'h2': ['36px', { lineHeight: '1.3' }],
        'h3': ['26px', { lineHeight: '1.3' }],
        'body': ['18px', { lineHeight: '1.7' }],
        'small': ['14px', { lineHeight: '1.6' }],
        
        // Mobile sizes
        'hero-mobile': ['38px', { lineHeight: '1.2' }],
        'h1-mobile': ['38px', { lineHeight: '1.2' }],
        'h2-mobile': ['28px', { lineHeight: '1.3' }],
        'body-mobile': ['16px', { lineHeight: '1.7' }],
      },
      letterSpacing: {
        'wide-caps': '0.15em',
        'wider-caps': '0.2em',
      },
      borderRadius: {
        'button': '14px',
      },
      spacing: {
        'section': '5rem',
        'section-mobile': '3rem',
      },
    },
  },
  plugins: [],
}
