/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF9",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#14171A",
          soft: "#3A3F44",
        },
        muted: "#6B7280",
        border: "#E7E5E2",
        accent: {
          DEFAULT: "#5B5FEF",
          dark: "#4548C9",
          light: "#EEEEFD",
        },
        positive: {
          DEFAULT: "#0F9D58",
          light: "#E7F6ED",
        },
        warn: {
          DEFAULT: "#E8590C",
          light: "#FDECE3",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(20, 23, 26, 0.04), 0 1px 8px -2px rgba(20, 23, 26, 0.06)",
        "card-hover": "0 4px 16px -4px rgba(20, 23, 26, 0.10), 0 2px 6px -2px rgba(20, 23, 26, 0.06)",
        glow: "0 0 0 1px rgba(91, 95, 239, 0.08), 0 8px 24px -8px rgba(91, 95, 239, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "sort-in": {
          "0%": { opacity: 0, transform: "translateX(-6px) scale(0.96)" },
          "100%": { opacity: 1, transform: "translateX(0) scale(1)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(91,95,239,0.35)" },
          "100%": { boxShadow: "0 0 0 8px rgba(91,95,239,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "sort-in": "sort-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
