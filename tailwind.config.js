/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
            '0 35px 35px rgba(0, 0, 0, 0.25)',
            '0 45px 65px rgba(0, 0, 0, 0.15)'
        ],
        '5xl': [
          '0 0 10px rgba(0, 0, 0, 0.25)'
      ]
      },
      colors:{
        "weather-primary" : "#33425B",
        "weather-secondary" : "#38817A",

      }
    },
    fontFamily:{
      Roboto: ["Roboto,sans-serif"]
    },
    container:{
      padding: "2rem",
      center: true,
    },
    screens:{
      sm:"640px",
      ms: "768px",
    }
  },
  plugins: [],
}

