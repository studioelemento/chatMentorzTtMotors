/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'zoom-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        }
      },
      animation: {
        'zoom-pulse': 'zoom-pulse 1s ease-in-out infinite',
      },
      colors: {
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        }
      }
    },
  },
  plugins: [],
}
