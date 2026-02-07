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
        bg: 'var(--bg)',
        text: 'var(--text)',
        olive: 'var(--olive)',
        moss: 'var(--moss)',
        terracotta: 'var(--terracotta)',
        mustard: 'var(--mustard)',
        burgundy: 'var(--burgundy)',
        gold: 'var(--gold)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        // Legacy aliases (admin + existing components)
        'off-white': 'var(--bg)',
        'warm-beige': 'var(--bg)',
        'olive-green': 'var(--olive)',
        'sage-green': 'var(--moss)',
        'soft-terracotta': 'var(--terracotta)',
        'coffee-brown': 'var(--text)',
        'graphite': 'var(--text)',
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
