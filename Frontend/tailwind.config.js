/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        panel: "#f8fafc",
        accent: "#0f766e",
        "accent-soft": "#ccfbf1",
        "accent-ink": "#134e4a",
      },
      boxShadow: {
        panel: "0 24px 60px -32px rgba(15, 23, 42, 0.38)",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
