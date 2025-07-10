/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Ubuntu Mono"', 'sans-serif'],
        special: ['Quantico'],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#101010',
        red: '#d13333',
        green: '#12c384',
        yellow: '#e6e619',
        blue: '#2a7bcf',
        purple: '#c044c0',
        cyan: '#12b0d6',
        white: '#e7e7e7',
        'bright-black': '#707070',
        'bright-red': '#f45656',
        'bright-green': '#26db96',
        'bright-yellow': '#f7f750',
        'bright-blue': '#4394ee',
        'bright-purple': '#db7cdc',
        'bright-cyan': '#33c3e1',
        'bright-white': '#e7e7e7',
        background: '#232323',
        foreground: '#d1d1d1',
        'selection-background': '#414449',
        'cursor-color': '#f0f0f0',
      },
    },
  },
  plugins: [],
};
