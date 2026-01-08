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
      },
    },
  },
  plugins: [],
};
