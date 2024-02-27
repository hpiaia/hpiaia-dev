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
        vcr: ["VCR OSD Mono"],
      },
      backgroundImage: {
        artifacts: "url(/images/effect-artifacts.gif)",
        static: "url(/images/effect-static.gif)",
      },
    },
  },
  plugins: [],
};

export default config;
