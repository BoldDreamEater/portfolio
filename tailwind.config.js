/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral near-black surfaces (no blue cast), after the reference design
        ink: {
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#151515',
          700: '#1c1c1c',
          600: '#262626',
          500: '#333333',
        },
        // Accent is an off-white: the design is monochrome, colour comes from the work itself
        accent: {
          DEFAULT: '#ecebe7',
          dim: '#a3a29d',
        },
        signal: '#5fd3a6',
        // Neutral warm greys replace Tailwind's blue-tinted slate. 500 and 600
        // both stay above WCAG AA (4.5:1) on the #0a0a0a background.
        slate: {
          50: '#fafaf8',
          100: '#f2f1ed',
          200: '#e2e1dc',
          300: '#c9c8c3',
          400: '#a3a29d',
          500: '#8f8e88',
          600: '#7f7e78',
          700: '#3a3a37',
          800: '#232321',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: { content: '1180px' },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        dash: {
          to: { strokeDashoffset: '-24' },
        },
        'panel-in': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        dash: 'dash 1.2s linear infinite',
        'panel-in': 'panel-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
