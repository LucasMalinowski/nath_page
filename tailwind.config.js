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
      },
      fontFamily: {
        serif: ['var(--font-title)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        poetic: ['var(--font-poetic)', 'Georgia', 'serif'],
      },
      fontSize: {
        h1: ['52px', { lineHeight: '1.1' }],
        'h1-mobile': ['36px', { lineHeight: '1.15' }],
        h2: ['36px', { lineHeight: '1.2' }],
        'h2-mobile': ['28px', { lineHeight: '1.25' }],
        h3: ['24px', { lineHeight: '1.3' }],
        'h3-mobile': ['20px', { lineHeight: '1.3' }],
        body: ['18px', { lineHeight: '1.7' }],
        'body-mobile': ['16px', { lineHeight: '1.65' }],
        small: ['14px', { lineHeight: '1.4' }],
        'small-mobile': ['13px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        soft: 'var(--shadow)',
      },
      spacing: {
        section: '5rem',
      },
    },
  },
  plugins: [],
}
