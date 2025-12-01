/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000', // Đen OLED
        surface: '#1C1C1E',    // Xám đậm
        danger: '#FF453A',     // Đỏ cam
        safe: '#30D158',       // Xanh lá
        primary: '#FFFFFF',    // Trắng
        secondary: '#8E8E93',  // Xám nhạt
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'sans-serif'],
      },
    },
  },
  plugins: [],
}