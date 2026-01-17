/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        dosis: "'Dosis', sans-serif",
        edu: "'Edu AU VIC WA NT Hand', cursive",
        anta: "'Anta', sans-serif",
      },
      colors: {
        primary: "#00ffa5",
        secondary: "#0f172a",
      },
      clipPath: {
        hexagon:"polygon(13% 0%, 87% 0%, 100% 50%,87% 100%,13% 100%,0% 50%)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwind-clip-path")],
  darkMode: "class",
};
