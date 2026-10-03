/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#064F8B',
        secondary: '#0F7BBD',
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};
