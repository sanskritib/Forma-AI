/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        canvas: '#FAF8F6',
        'frame-fill': '#F6F8F1',
        'frame-border': '#8FB642',
        'border-default': '#E0DED7',
        'chip-bg': '#F8F7F4',
        'text-secondary': '#5C5C5C',
        'text-tertiary': '#727272',
        'text-placeholder': '#B4B5B2',
        'icon-default': '#424242',
        'btn-green': '#33411A',
        'tool-active': '#436A00',
        'apply-text': '#5E7A4D',
      },
      boxShadow: {
        panel: '0px 23px 48px 0px rgba(0,0,0,0.1)',
        'frame-glow': '0px 13px 32.7px 0px rgba(143,182,66,0.5)',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, #E0DED7 1.5px, transparent 1.5px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      borderRadius: {
        '15': '15px',
      },
    },
  },
  plugins: [],
}
