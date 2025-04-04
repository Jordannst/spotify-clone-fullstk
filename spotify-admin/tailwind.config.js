/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // File utama HTML
    "./src/**/*.{js,ts,jsx,tsx}", // File React di folder src
  ],
  theme: {
    extend: {}, // Tempat untuk modifikasi kustom
  },
  plugins: [],
};
  