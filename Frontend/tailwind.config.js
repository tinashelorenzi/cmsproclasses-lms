/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cms-primary': '#0178c5',
        'cms-secondary': '#ffcf00',
        'cms-dark': '#000004',
        'cms-white': '#ffffff',
      },
    },
  },
  plugins: [],
}

