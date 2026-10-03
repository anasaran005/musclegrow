import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF5",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#14532D",
          hover: "#166534",
          light: "#DCFCE7",
          dark: "#052e16",
        },
        lime: {
          brand: "#A3E635",
          light: "#ECFCCB",
        },
        cta: {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          light: "#FFEDD5",
        },
        macro: {
          protein: "#16A34A",
          proteinBg: "#DCFCE7",
          proteinBorder: "#86EFAC",
          carbs: "#D97706",
          carbsBg: "#FEF3C7",
          carbsBorder: "#FDE68A",
          fat: "#9333EA",
          fatBg: "#F3E8FF",
          fatBorder: "#D8B4FE",
          calories: "#EA580C",
          caloriesBg: "#FFEDD5",
          caloriesBorder: "#FDBA74",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "var(--font-jakarta)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        float: "0 20px 30px -10px rgba(20, 83, 45, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
