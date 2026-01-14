import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'background-light': '#f8fafc',
        'background-dark': '#0f172a',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        emerald: '0 4px 20px 0 rgba(16, 185, 129, 0.2)',
        blue: '0 4px 20px 0 rgba(37, 99, 235, 0.2)',
        purple: '0 4px 20px 0 rgba(139, 92, 246, 0.2)',
        orange: '0 4px 20px 0 rgba(249, 115, 22, 0.2)',
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
}
