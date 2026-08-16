/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50, #ecfdf5)',
          100: 'var(--primary-100, #d1fae5)',
          200: 'var(--primary-200, #a7f3d0)',
          300: 'var(--primary-300, #6ee7b7)',
          400: 'var(--primary-400, #34d399)',
          500: 'var(--primary-500, #10b981)',
          600: 'var(--primary-600, #059669)',
          700: 'var(--primary-700, #047857)',
          800: 'var(--primary-800, #065f46)',
          900: 'var(--primary-900, #064e3b)',
          DEFAULT: 'var(--primary-color, #10b981)',
        },
        surface: {
          base: 'var(--surface-base, #ffffff)',
          subtle: 'var(--surface-subtle, #f8fafc)',
          elevated: 'var(--surface-elevated, #ffffff)',
          border: 'var(--surface-border, #e2e8f0)',
          dark: {
            base: 'var(--dark-surface-base, #0b0f19)',
            subtle: 'var(--dark-surface-subtle, #111827)',
            elevated: 'var(--dark-surface-elevated, #1f2937)',
            border: 'var(--dark-surface-border, #1e293b)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
