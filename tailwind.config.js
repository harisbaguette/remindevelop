/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'toss-blue': '#3182F6',
        'toss-blue-light': '#E8F3FF',
        'toss-grey-50': '#F9FAFB',
        'toss-grey-100': '#F2F4F6',
        'toss-grey-200': '#E5E8EB',
        'toss-grey-300': '#D1D6DB',
        'toss-grey-400': '#B0B8C1',
        'toss-grey-500': '#8B95A1',
        'toss-grey-600': '#6B7684',
        'toss-grey-700': '#4E5968',
        'toss-grey-800': '#333D4B',
        'toss-grey-900': '#191F28',
        'toss-red': '#F04452',
        'toss-red-light': '#FEECEF',
      },
      borderRadius: {
        'toss': '20px',
        'toss-sm': '12px',
      }
    },
  },
  plugins: [],
}
