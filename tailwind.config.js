/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
