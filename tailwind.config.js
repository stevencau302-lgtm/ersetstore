/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff5f0',
          100: '#ffe4d6',
          500: '#ff5722',
          600: '#e64a19',
          700: '#d84315',
        },
        ink: {
          900: '#0f1115',
          800: '#1a1d24',
          700: '#252932',
          500: '#6b7280',
        },
        // Custom surface colors (nyaman di mata)
        surface: {
          DEFAULT: '#fafaf7',  // page background (warm, soft)
          card: '#ffffff',     // card bg stays white
          muted: '#f2f2ed',   // muted sections
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
    },
  },
  plugins: [],
};
