/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          blue: '#08B5E5',
          dark: '#0e141f',
          light: '#f3f9fc',
          accent: '#14b8a6',
        },
        ph: {
          blue: '#0038A8',
          red: '#CE1126',
          gold: '#FCD116',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
