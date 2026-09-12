/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#08090b',
          850: '#0b0d10',
          800: '#101317',
          700: '#171b21',
          600: '#222831',
          500: '#2e3641',
        },
        accent: {
          DEFAULT: '#4ea3ff',
          dim: '#2b6fb3',
        },
        signal: '#5fd3a6',
        // Tailwind's stock slate-500/600 fall below WCAG AA on this
        // near-black background, so the two dimmest steps are lifted.
        slate: {
          500: '#7b8798',
          600: '#737f90',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
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
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        dash: 'dash 1.2s linear infinite',
      },
    },
  },
  plugins: [],
}
