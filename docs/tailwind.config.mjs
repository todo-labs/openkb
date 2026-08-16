/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './content/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../packages/renderer/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50, #ecfdf5)',
          100: 'var(--primary-100, #d1fae5)',
          500: 'var(--primary-500, #10b981)',
          600: 'var(--primary-600, #059669)',
          DEFAULT: 'var(--primary-color, #10b981)',
        },
      },
    },
  },
  plugins: [],
};
