/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard',
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        display: ['Plus Jakarta Sans', 'Pretendard', 'sans-serif'],
      },
      colors: {
        ivory: '#FAF8F6',
        'dining-dark': '#121011',
        'card-dark': '#1C1819',
        'sub-light': '#F2EEEB',
        'sub-dark': '#262022',
        ink: '#1C191A',
        'ink-light': '#F5F1ED',
        taupe: '#6E6568',
        'taupe-light': '#B5AAAE',
        burgundy: {
          DEFAULT: '#6B1D2F',
          hover: '#561524',
          tint: '#F5EBEF',
          'dark-tint': '#2E181F',
        },
        gold: {
          DEFAULT: '#B8863B',
          deep: '#7D581F',
          tint: '#FBF5EA',
          'dark-tint': '#2C2314',
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(28, 25, 26, 0.04)',
        'card-hover': '0 6px 24px rgba(28, 25, 26, 0.08)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.36)',
      },
    },
  },
  plugins: [],
};
