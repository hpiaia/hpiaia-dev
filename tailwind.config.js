/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        vcr: ["VCR OSD Mono"],
      },
      cursor: {
        default: "url(/images/cursor-default.png) 0 0, default",
        pointer: "url(/images/cursor-pointer.png) 10 0, pointer",
      },
      backgroundImage: {
        artifacts: "url(/images/effect-artifacts.gif)",
        static: "url(/images/effect-static.gif)",
      },
    },
  },
  plugins: [],
};
