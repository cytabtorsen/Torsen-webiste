import type { Config } from "tailwindcss";

/**
 * Torsen design tokens.
 * Palette is deliberately tight (≤4 hues): near-black ground, one cool accent
 * (teal = "grounded / verified"), one warm accent (amber = the "why" signature).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: "#0B0E14", // near-black background
          raised: "#0F141C", // raised surfaces / cards
          line: "#1B2230", // hairline borders
        },
        ink: {
          DEFAULT: "#E6EAF2", // primary text
          dim: "#9AA4B2", // secondary text
          faint: "#5C6677", // tertiary / labels
        },
        teal: {
          DEFAULT: "#16C79A", // grounded / verified
          dim: "#0E8C6C",
        },
        amber: {
          DEFAULT: "#FFB454", // the "why" highlight
          dim: "#C8821F",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        // Headlines only — the one display face. Falls back to the body sans.
        display: ["var(--font-space-grotesk)", "var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem", // shared page gutter width
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(255, 180, 84, 0.35)", // amber "why" glow
        "glow-teal": "0 0 36px -10px rgba(22, 199, 154, 0.30)",
      },
      keyframes: {
        "trace-draw": {
          from: { strokeDashoffset: "var(--trace-len, 1000)" },
          to: { strokeDashoffset: "0" },
        },
        "pulse-node": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.25)" },
        },
        "why-glow": {
          "0%, 100%": { opacity: "0.85", filter: "drop-shadow(0 0 6px rgba(255,180,84,0.35))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 16px rgba(255,180,84,0.55))" },
        },
      },
      animation: {
        "trace-draw": "trace-draw 2.4s ease-out forwards",
        "pulse-node": "pulse-node 3.2s ease-in-out infinite",
        "why-glow": "why-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
