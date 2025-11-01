/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto Mono"', 'monospace'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        hirescope: {
          blue: "#3b82f6",
          dark: "#0f172a",
          light: "#f8fafc",
          accent: "#6366f1",
          success: "#10b981",
          warning: "#f59e0b",
        },
        border: "hsl(214.3 31.8% 91.4%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
