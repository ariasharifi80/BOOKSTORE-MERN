/** @type {import('tailwindcss').Config} */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pop: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },
      animation: {
        pop: "pop 200ms ease-in-out",
      },
    },
  },
  plugins: [],
};
