/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      opacity: {
        0: '0',
        2: '0.02',
        3: '0.03',
        4: '0.04',
        6: '0.06',
        7: '0.07',
        8: '0.08',
        9: '0.09',
        12: '0.12',
        13: '0.13',
        16: '0.16',
        18: '0.18',
        22: '0.22',
        88: '0.88',
        92: '0.92',
        97: '0.97',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      colors: {
        night: {
          950: '#03130d',
          900: '#051c14',
          800: '#07271d',
          700: '#0a3327',
        },
        forest: {
          900: '#06301f',
          800: '#0a4030',
          700: '#0f5340',
          600: '#166952',
        },
        emeraldx: {
          500: '#22a37a',
          400: '#35c394',
          300: '#63d9b3',
        },
        gold: {
          600: '#9c7c2c',
          500: '#c9a24b',
          400: '#ddbc6b',
          300: '#ecd9a0',
          200: '#f5ebcd',
        },
        cream: {
          50: '#faf6ec',
          100: '#f4ecd9',
          200: '#e9dec4',
        },
        ink: {
          900: '#0b251c',
          700: '#2c4a3f',
          500: '#54716a',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        arabic: ['Amiri', 'Scheherazade New', 'Traditional Arabic', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(201,162,75,0.45)',
        card: '0 12px 32px -16px rgba(0,0,0,0.55)',
        soft: '0 8px 24px -12px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.86)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '70%': { transform: 'scale(1.06)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(221,188,107,0.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(221,188,107,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(221,188,107,0)' },
        },
        'rays-rotate': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease both',
        'slide-up': 'slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'sheet-up': 'sheet-up 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'spin-slow': 'spin-slow 26s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'rays-rotate': 'rays-rotate 14s linear infinite',
      },
    },
  },
  plugins: [],
};
