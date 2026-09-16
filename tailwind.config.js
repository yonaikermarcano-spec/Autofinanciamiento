/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          50: "#E8F0FE",
          100: "#D2E3FC",
          200: "#AECBFA",
          300: "#8AB4F8",
          400: "#5F9BFF",
          500: "#1A73E8",
          600: "#1558D6",
          700: "#0B57D0",
          800: "#174EA6",
          900: "#1F3A5F",
        },
        neutral: {
          50: "#F8F9FA",
          100: "#F1F3F4",
          200: "#E0E0E0",
          300: "#DADCE0",
          400: "#9AA0A6",
          500: "#5F6368",
          600: "#3C4043",
          700: "#202124",
          800: "#1F1F1F",
          900: "#18181B",
        },
        brand: {
          50: "#E8F0FE",
          100: "#D2E3FC",
          500: "#1A73E8",
          600: "#1558D6",
          700: "#0B57D0",
          800: "#174EA6",
          900: "#1F3A5F",
        },
        slate: {
          850: "#151e2e",
          900: "#0f172a",
          950: "#020617"
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(60,64,67,0.15), 0 1px 3px 1px rgba(60,64,67,0.08)",
        card: "0 1px 2px rgba(32,33,36,0.08), 0 2px 8px rgba(32,33,36,0.04)",
      },
      borderRadius: {
        xl: "18px",
        xxl: "24px",
      },
    },
  },
  plugins: [],
};
