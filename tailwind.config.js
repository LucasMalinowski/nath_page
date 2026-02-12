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
        bg: 'rgb(var(--bg, 245 241 235) / <alpha-value>)',
        text: 'rgb(var(--text, 59 47 38) / <alpha-value>)',
        olive: 'rgb(var(--olive, 78 95 74) / <alpha-value>)',
        moss: 'rgb(var(--moss, 107 122 94) / <alpha-value>)',
        terracotta: 'rgb(var(--terracotta, 198 106 61) / <alpha-value>)',
        mustard: 'rgb(var(--mustard, 217 182 94) / <alpha-value>)',
        burgundy: 'rgb(var(--burgundy, 90 30 35) / <alpha-value>)',
        gold: 'rgb(var(--gold, 184 155 94) / <alpha-value>)',
        surface: 'rgb(var(--surface, 255 255 255) / 0.6)',
        border: 'rgb(var(--border, 59 47 38) / 0.18)',
        // Legacy aliases (admin + existing components)
        'off-white': 'rgb(var(--bg, 245 241 235) / <alpha-value>)',
        'warm-beige': 'rgb(var(--bg, 245 241 235) / <alpha-value>)',
        'olive-green': 'rgb(var(--olive, 78 95 74) / <alpha-value>)',
        'sage-green': 'rgb(var(--moss, 107 122 94) / <alpha-value>)',
        'soft-terracotta': 'rgb(var(--terracotta, 198 106 61) / <alpha-value>)',
        'coffee-brown': 'rgb(var(--text, 59 47 38) / <alpha-value>)',
        'graphite': 'rgb(var(--text, 59 47 38) / <alpha-value>)',
        dirt: 'rgb(var(--dirt, 59 47 38) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        poetic: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        // Desktop sizes
        'hero': ['52px', { lineHeight: '1.2' }],
        'h1': ['52px', { lineHeight: '1.2' }],
        'h2': ['36px', { lineHeight: '1.3' }],
        'h3': ['24px', { lineHeight: '1.35' }],
        'body': ['18px', { lineHeight: '1.7' }],
        'small': ['14px', { lineHeight: '1.6' }],
        
        // Mobile sizes
        'hero-mobile': ['36px', { lineHeight: '1.2' }],
        'h1-mobile': ['36px', { lineHeight: '1.2' }],
        'h2-mobile': ['28px', { lineHeight: '1.3' }],
        'h3-mobile': ['20px', { lineHeight: '1.35' }],
        'body-mobile': ['16px', { lineHeight: '1.7' }],
      },
      letterSpacing: {
        'wide-caps': '0.15em',
        'wider-caps': '0.2em',
      },
      borderRadius: {
        'button': '12px',
      },
      spacing: {
        'section': '5rem',
        'section-mobile': '3rem',
      },
    },
  },
  plugins: [],
}
