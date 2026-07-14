/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to look at your React files!
  ],
  theme: {
    extend: {
      colors: {
        fifa: {
          black: '#000000',
          white: '#FFFFFF',
          red: '#E6332A',
          maroon: '#8B1C31',
          purple: '#6B2B8E',
          blue: '#1E3A8A',
          cyan: '#00E5FF',
          green: '#00B140',
          lime: '#C4D600',
        }
      },
      fontFamily: {
  display: ['Unbounded', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
    }
  },
  plugins: [],
}