/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          dark: '#0a0a0a',
          darker: '#000000',
          red: '#ff0000',
          orange: '#ff4500',
          yellow: '#ffd700',
        },
      },
      fontFamily: {
        brutal: ['Arial Black', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}

