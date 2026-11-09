import { type Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#064E3B", // Dark Green
          light: "#065F46",
          dark: "#022C22",
        },
        secondary: {
          DEFAULT: "#059669", // Emerald Green
          light: "#10B981",
          dark: "#047857",
        },
        accent: {
          DEFAULT: "#F3F4F6", // Light Gray
          dark: "#E5E7EB",
        },
        background: "#FFFFFF",
        text: {
          DEFAULT: "#111827", // Black/Dark Gray
          light: "#4B5563",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
        garamond: ['"Cormorant Garamond"', "serif"],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #064E3B 0%, #059669 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config;
