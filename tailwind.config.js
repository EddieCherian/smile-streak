/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        pop: "pop 0.25s ease-out",
        glow: "glow 1.2s ease-in-out infinite",
        fade: "fade 0.4s ease-out",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 0px rgba(249,115,22,0)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(249,115,22,0.6)",
          },
        },
        fade: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
