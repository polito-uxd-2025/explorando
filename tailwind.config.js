/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "var(--primary-50, #f0f9ff)",
          100: "var(--primary-100, #e0f2fe)",
          200: "var(--primary-200, #bae6fd)",
          500: "var(--primary-500, #0ea5e9)",
          600: "var(--primary-600, #0284c7)",
          700: "var(--primary-700, #0369a1)",
          900: "var(--primary-900, #082f49)",
        },
        accent: {
          50: "var(--accent-50, #fff5ed)",
          500: "var(--accent-500, #ff570a)",
          600: "var(--accent-600, #e64d00)",
        },
        shop: {
          50: "var(--shop-50, #fef3c7)",
          100: "var(--shop-100, #fde68a)",
          200: "var(--shop-200, #fcd34d)",
          300: "var(--shop-300, #fbbf24)",
          400: "var(--shop-400, #f59e0b)",
          500: "var(--shop-500, #eab308)",
          600: "var(--shop-600, #ca8a04)",
          700: "var(--shop-700, #a16207)",
          800: "var(--shop-800, #854d0e)",
          900: "var(--shop-900, #713f12)",
        },
      },
    },
  },
  plugins: [],
};
