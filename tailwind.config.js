/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e1f5ee",
          100: "#c7ecdf",
          200: "#9adcc4",
          300: "#67c7a6",
          400: "#38ab86",
          500: "#188a68",
          600: "#0f6e56",
          700: "#0c5945",
          800: "#0a4738",
          900: "#083a2e",
        },
        ink: {
          50: "#f1efe8",
          100: "#e3e1d8",
          300: "#b4b2a9",
          500: "#888780",
          700: "#5f5e5a",
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
