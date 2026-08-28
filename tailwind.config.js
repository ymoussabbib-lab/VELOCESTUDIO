/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F2EFE8",
        "paper-alt": "#EAE6DC",
        ink: "#17150F",
        "ink-soft": "#2A2620",
        "ink-muted": "#3B372E",
        "grey-600": "#5A554A",
        "grey-400": "#8A857A",
        line: "#D6D1C5",
        "line-alt": "#C9C4B7",
        track: "#E3DFD4",
        "on-dark": "#F2EFE8",
        "on-dark-muted": "#A8A29A",
        "on-dark-log": "#EDE9E0",
        "line-dark": "#4A453C",
        "line-dark-alt": "#3A362E",
        accent: "#C7371A",
        fitpulse: "#0F7B5A",
        estatepulse: "#1B4DE4",
        salonflow: "#A31C4B",
        restaurant: "#C7371A",
        dajjaj: "#7A5C00",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "Archivo", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
