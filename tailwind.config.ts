import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        mortafy: {
          navy: "#130936",
          purple: "#A82FFC",
          purpleGlow: "#C46BFF",
          cardLeft: "#C2D1D4",
          sheetWhite: "#F4F7F8",
          lilacStart: "#B9A7C9",
          lilacMid: "#B4A0C8",
          lilacEnd: "#9882B0",
          green: "#3B7A2E",
          red: "#EF4444",
          amber: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};

export default config;
