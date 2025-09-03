import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'be-vietnam': ['var(--font-be-vietnam)', 'sans-serif'],
      },
      colors: {
        primary: {
          text: '#2E2E2E',
          background: '#BEF3B8',
          card: '#E1FFDD',
        }
      }
    },
  },
  plugins: [],
};

export default config;
