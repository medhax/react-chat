/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
 
  ],
  theme: {
    screens: {
      mobile: "250px",
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },

    extend: {
      colors: {
        plaved: "#0F6BAC",
        "plaved-2": "#238BD8",
        "plaved-3": "#111111",
        "plaved-4": "#F5FCFF",
        "plaved-5": "#5B5B5B",
        "plaved-6": "#B5B5B5",
        "plaved-7": "#EAEAEA",

        plavedy: "linear-gradient(180deg, #0F6BAC 0%, #258BD6 100%)",
        disabledColor: "#D9DFE2",
        "input-field": "#FAFAFA",
      },
      backgroundColor: {
        "plaved-gradient-1":
          "linear-gradient(to right bottom, rgba('#7ed56f',0.8), rgba('#28b485',0.8))",
        "plaved-gradient-2":
          "linear-gradient(180deg, #42CAFD 0%, #258BD6 100%)",
      },

      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        Montserrat: ["Montserrat Regular"],
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
};
