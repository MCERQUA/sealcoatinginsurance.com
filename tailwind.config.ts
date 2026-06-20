import type { Config } from "tailwindcss";

/* ============================================================
   SEALCOATING INSURANCE — "Asphalt Black & Bright Yellow" palette
   Token NAMES are inherited from the shared component architecture;
   VALUES are remapped to bright yellow (primary) / asphalt black
   (secondary) / gold accent.
   clay = bright yellow · sage = asphalt black · gold = gold accent
   cream = off-white paper · sand = light gray
   ============================================================ */

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAFAFA",
        sand: "#F5F5F0",
        white: "#FFFFFF",
        clay: {
          DEFAULT: "#E8C010",
          dark: "#C9A508",
          light: "#F0D040",
          50: "#FFFCE8",
          100: "#FFF8C4",
          200: "#FFEF85",
          300: "#F5D020",
          400: "#E8C010",
          500: "#C9A508",
          600: "#A88600",
          700: "#856900",
          800: "#614C00",
          900: "#3D3000",
        },
        sage: {
          DEFAULT: "#1A1A1A",
          dark: "#0D0D0D",
          light: "#333333",
          50: "#F0F0F0",
          100: "#D9D9D9",
          200: "#B3B3B3",
          300: "#808080",
          400: "#555555",
          500: "#333333",
          600: "#1A1A1A",
          700: "#0D0D0D",
        },
        gold: {
          DEFAULT: "#F5D020",
          dark: "#D4B010",
          light: "#FAE050",
          50: "#FFFDE8",
          100: "#FFF9C2",
          200: "#FFF083",
          300: "#FAE050",
          400: "#F5D020",
          500: "#D4B010",
          600: "#A88800",
        },
        espresso: "#0A0A0A",
        cocoa: "#1E1E1E",
        mocha: "#444444",
        adobe: { DEFAULT: "#E0DDD0", dark: "#C8C5B8" },
        adobeDark: "#C8C5B8",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        arch: "2rem 2rem 2rem 2rem",
        arch2: "2.5rem 2.5rem 1.5rem 1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "sunrise-bands":
          "linear-gradient(180deg, #FAFAFA 0%, #F5F5F0 40%, #F0F0E8 70%, #FAFAFA 100%)",
        "warm-radial":
          "radial-gradient(circle at 30% 20%, rgba(232,192,16,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(26,26,26,0.08) 0%, transparent 55%)",
        "clay-gradient": "linear-gradient(135deg, #E8C010 0%, #F0D040 100%)",
        "sage-gradient": "linear-gradient(135deg, #1A1A1A 0%, #333333 100%)",
        "gold-gradient": "linear-gradient(135deg, #F5D020 0%, #FAE050 100%)",
      },
      boxShadow: {
        warm: "0 10px 40px -15px rgba(201,165,8,0.30), 0 4px 12px -6px rgba(10,10,10,0.08)",
        "warm-lg": "0 30px 70px -20px rgba(201,165,8,0.36), 0 10px 30px -10px rgba(10,10,10,0.10)",
        card: "0 2px 8px -2px rgba(10,10,10,0.06), 0 1px 3px -1px rgba(10,10,10,0.04)",
        "card-hover": "0 20px 50px -15px rgba(201,165,8,0.28), 0 8px 20px -8px rgba(10,10,10,0.10)",
        arch: "inset 0 -8px 30px -10px rgba(232,192,16,0.12)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slow-zoom": { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "arch-rise": { "0%": { transform: "scaleY(0.6)", opacity: "0", transformOrigin: "bottom" }, "100%": { transform: "scaleY(1)", opacity: "1", transformOrigin: "bottom" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "slow-zoom": "slow-zoom 20s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "arch-rise": "arch-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
