export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        cream: { DEFAULT: "#FDF8F3", dark: "#F5EDE0" },
        beige: { DEFAULT: "#E8D5C0", dark: "#D4B896" },
        nude: { DEFAULT: "#C9A882", dark: "#A8845E" },
        "warm-white": "#FEFCFA",
        gold: { DEFAULT: "#B8960C", light: "#D4AF37", pale: "#F0E4A8" },
        charcoal: { DEFAULT: "#1A1A1A", soft: "#2D2D2D" },
        rose: { DEFAULT: "#E8A598", light: "#F5D0C8" },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
