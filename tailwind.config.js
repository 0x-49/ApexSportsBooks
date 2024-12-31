/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7e6',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        parchment: {
          50: '#fdfaf5',
          100: '#fbf5eb',
          200: '#f7ebd6',
          300: '#f3e1c2',
          400: '#efd7ad',
          500: '#ebcd99',
          600: '#d7b98a',
          700: '#c3a57b',
          800: '#af916c',
          900: '#9b7d5d',
        },
        brown: {
          50: '#f8f5f2',
          100: '#f1ebe5',
          200: '#e3d7cb',
          300: '#d5c3b1',
          400: '#c7af97',
          500: '#b99b7d',
          600: '#9b8268',
          700: '#7d6953',
          800: '#5f503e',
          900: '#413729',
        },
        orange: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },
        yellow: {
          50: '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#ffeb3b',
          600: '#fdd835',
          700: '#fbc02d',
          800: '#f9a825',
          900: '#f57f17',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
