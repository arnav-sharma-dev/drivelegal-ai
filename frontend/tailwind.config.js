/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0b0f19', // Sleek background dark slate
        },
        accent: {
          emerald: '#10b981', // Accents for compliance success
          coral: '#f43f5e', // Accents for infraction / danger warnings
          amber: '#f59e0b', // Accents for fine calculations / warnings
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 15px -3px rgba(99, 102, 241, 0.4)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
