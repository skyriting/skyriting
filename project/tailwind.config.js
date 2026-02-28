/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        luxury: ['Helvetica', 'sans-serif'],
      },
      colors: {
        luxury: {
          red: {
            DEFAULT: '#ce3631',
            dark: '#711d1b',
            light: '#ad302d',
            hover: '#b82e29',
          },
          black: {
            DEFAULT: '#000000',
            soft: '#1a1a1a',
            light: '#2a2a2a',
          },
          white: {
            DEFAULT: '#ffffff',
            off: '#fafafa',
            cream: '#f8f8f8',
          },
        },
      },
      letterSpacing: {
        luxury: '0.08em',
        wide: '0.05em',
      },
    },
  },
  plugins: [],
};
