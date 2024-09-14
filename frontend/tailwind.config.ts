import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#F9F7F7",
        softBlue: "#DBE2EF",
        darkBlue: "#3F72AF",
        navy: "#112D4E",
      },
    },
  },
  plugins: [],
};

export default config;
