import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        'malachite': {
          50: '#eefff4',
          100: '#d7ffe6',
          200: '#b2ffd0',
          300: '#76ffac',
          400: '#33f581',
          500: '#09de5e',
          600: '#00c951',
          700: '#04913e',
          800: '#0a7135',
          900: '#0a5d2e',
          950: '#003417',
        },
        'dawn-pink': {
          50: '#f8f5f4',
          100: '#ebe5e1',
          200: '#dcd2cc',
          300: '#c6b4ab',
          400: '#af9388',
          500: '#9e7b71',
          600: '#916c65',
          700: '#795955',
          800: '#644a48',
          900: '#523e3c',
          950: '#2b201f',
        },
        'bunker': {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e3',
          300: '#afb9ca',
          400: '#8493ac',
          500: '#647593',
          600: '#505e79',
          700: '#414c63',
          800: '#394253',
          900: '#333a47',
          950: '#111318',
        },
      },
    },
  },
  plugins: [
    daisyui,
  ],

  daisyui: {
    logs: false,
    themes: [{
      dark: {
        'primary': '#00c951',
        'secondary': '#E26216',
        'accent': '#EBE5E1',
        'neutral': '#EBE5E1',
        'base-100': '#111318',
        'info': '#00ff66',
        'success': '#00ff66',
        'warning': '#ed8345',
        'error': '#ff5449',
        '--rounded-box': '0.25rem',
        '--rounded-btn': '0.25rem',
      },
    }],
  },
}
