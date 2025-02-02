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
        'primary': '#114c8e',
        'secondary': '#EE6f0f',
        'accent': '#ffffff',
        'neutral': '#909094',
        'base-100': '#111318',
        'info': '#a8c8ff',
        'success': 'oklch(0.723 0.219 149.579)',
        'warning': '#ffb68e',
        'error': '#ff5449',
        '--rounded-box': '0.25rem',
        '--rounded-btn': '0.25rem',
      },
    }],
  },
}
