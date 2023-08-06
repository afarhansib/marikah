/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/index.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

