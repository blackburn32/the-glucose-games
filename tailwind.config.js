import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
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
