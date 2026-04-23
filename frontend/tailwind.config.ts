import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#b8defe',
          300: '#8dc4fb',
          400: '#5aa6f6',
          500: '#3388ea',
          600: '#256dd0',
          700: '#1f58a7',
          800: '#1d4a88',
          900: '#1c3f70'
        }
      },
      boxShadow: {
        glow: '0 30px 90px rgba(37, 109, 208, 0.18)'
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        fadeIn: 'fadeIn .45s ease-out both'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
