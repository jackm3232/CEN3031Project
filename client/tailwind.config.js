/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "customblue":{
          '100' : "a9c8d0",
          '200' : "1d4a59"
        }
    },
  },
  plugins: [],
}
}