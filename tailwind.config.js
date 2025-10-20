/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4CAF50',       // Main green
        'secondary': '#FF6347',     // Tomato red (for carbon)
        'accent': '#26A69A',        // A new, distinct Teal color (for the 'Analyze Soil' button)
        'background': '#f4f4f5',    // Light gray (page background)
        'surface': '#ffffff',       // White (for cards)
        'text-primary': '#1a1a1a',  // Dark black (for headings)
        'text-secondary': '#525252', // Lighter gray (for sub-text)
      },
    },
  },
  plugins: [],
}