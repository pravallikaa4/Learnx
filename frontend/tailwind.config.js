/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#1E40AF",
        bg: "#F8FAFC",
        lightBlue: "#E0E7FF",
        dark: "#0F172A"
      }
    },
  },
  plugins: [],
}
