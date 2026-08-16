import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#6b21a8',
          700: '#581c87',
          800: '#4c1d95',
          900: '#3b0764',
          950: '#2e1065',
        },
        clinik: {
          violet: '#6d28d9',
          purple: '#7c3aed',
          pink: '#ec4899',
          emerald: '#059669',
          mint: '#f0fdf4',
          dark: '#0f172a',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(107, 33, 168, 0.25)',
        violetGlow: '0 0 25px -5px rgba(124, 58, 237, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
