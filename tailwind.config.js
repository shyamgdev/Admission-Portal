module.exports = {
  content: [
    "./src/*.{html,js,css} ",
    "./views/**/*.ejs",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F3F4F6"
      }
    },

  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};