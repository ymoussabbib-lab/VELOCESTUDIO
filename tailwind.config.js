/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0F17",
        surface: "#161E2E",
        surfaceHover: "#1E293B",
        accentCyan: "#06B6D4",
        accentTeal: "#14B8A6",
        statusEmerald: "#10B981",
        mutedText: "#94A3B8",
        brightText: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
