import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand (uses CSS variables for theming)
        brand: {
          50:  "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
        },
        // Accent
        accent: {
          50:  "#fff0fa",
          100: "#ffe0f5",
          200: "#ffbbea",
          300: "#ffaaee",
          400: "rgb(var(--accent-400) / <alpha-value>)",
          500: "rgb(var(--accent-500) / <alpha-value>)",
          600: "rgb(var(--accent-600) / <alpha-value>)",
          700: "#992277",
          800: "#661155",
          900: "#440a38",
          950: "#220520",
        },
        // Success
        success: {
          400: "rgb(var(--success-400) / <alpha-value>)",
          500: "rgb(var(--success-500) / <alpha-value>)",
          600: "rgb(var(--success-600) / <alpha-value>)",
        },
        // Warning
        warning: {
          400: "rgb(var(--warning-400) / <alpha-value>)",
          500: "rgb(var(--warning-500) / <alpha-value>)",
          600: "rgb(var(--warning-600) / <alpha-value>)",
        },
        // Danger
        danger: {
          400: "rgb(var(--danger-400) / <alpha-value>)",
          500: "rgb(var(--danger-500) / <alpha-value>)",
          600: "rgb(var(--danger-600) / <alpha-value>)",
          900: "#440a0e",
        },
        // Dark UI surfaces
        surface: {
          900: "rgb(var(--surface-900) / <alpha-value>)",
          800: "rgb(var(--surface-800) / <alpha-value>)",
          700: "rgb(var(--surface-700) / <alpha-value>)",
          600: "rgb(var(--surface-600) / <alpha-value>)",
          500: "rgb(var(--surface-500) / <alpha-value>)",
          400: "rgb(var(--surface-400) / <alpha-value>)",
        },
        // Theme-aware text colors
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          subtle: "rgb(var(--text-subtle) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "pixel": "2px",
        "pixel-lg": "4px",
      },
      boxShadow: {
        glow:          "4px 4px 0px 0px rgba(57, 255, 20, 0.4)",
        "glow-accent": "4px 4px 0px 0px rgba(255, 68, 204, 0.4)",
        "glow-success":"3px 3px 0px 0px rgba(0, 255, 170, 0.3)",
        "inner-glow":  "inset 0 0 0 2px rgba(57, 255, 20, 0.08)",
        card:          "4px 4px 0px 0px rgba(0,0,0,0.6)",
        float:         "6px 6px 0px 0px rgba(0,0,0,0.7)",
        "pixel-inset": "inset 2px 2px 0px 0px rgba(0,0,0,0.4)",
        "pixel-raised":"inset -1px -1px 0px 0px rgba(0,0,0,0.3), inset 1px 1px 0px 0px rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-surface": "linear-gradient(135deg, #111428 0%, #191d38 50%, #0b0d1a 100%)",
      },
      animation: {
        "pulse-slow":    "pulse 3s steps(6) infinite",
        "spin-slow":     "spin 8s steps(16) infinite",
        "float":         "pixelFloat 2s steps(4) infinite",
        "shimmer":       "pixelShimmer 1.5s steps(8) infinite",
        "glow-pulse":    "pixelGlowPulse 2s steps(4) infinite",
        "slide-up":      "slideUp 0.3s steps(4)",
        "slide-down":    "slideDown 0.3s steps(4)",
        "fade-in":       "fadeIn 0.2s steps(3)",
        "scale-in":      "scaleIn 0.15s steps(3)",
      },
      keyframes: {
        pixelFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-4px)" },
        },
        pixelShimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pixelGlowPulse: {
          "0%, 100%": { opacity: "1", boxShadow: "4px 4px 0px 0px rgba(57,255,20,0.4)" },
          "50%":      { opacity: "0.8", boxShadow: "6px 6px 0px 0px rgba(57,255,20,0.6)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionTimingFunction: {
        pixel: "steps(4, end)",
      },
    },
  },
  plugins: [],
};

export default config;
