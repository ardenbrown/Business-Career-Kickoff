import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f5f8fc",
        foreground: "#10213d",
        primary: {
          DEFAULT: "#2457d6",
          foreground: "#f8fbff",
          50: "#eef4ff",
          100: "#dbe8ff",
          200: "#bfd5ff",
          300: "#93b5ff",
          400: "#5d8cff",
          500: "#2457d6",
          600: "#1e46aa",
          700: "#1d3b88",
          800: "#1d336f",
          900: "#1d2e5c"
        },
        slateBlue: "#dce7fb",
        ink: "#10213d",
        mist: "#eff4fb",
        border: "#d6e0f3",
        card: "#ffffff",
        muted: "#64748b",
        success: "#0f9f6e",
        warning: "#d97706",
        danger: "#c2410c"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(36,87,214,0.18), transparent 28%), radial-gradient(circle at top right, rgba(15,159,110,0.12), transparent 24%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%)",
      },
      boxShadow: {
        panel: "0 18px 65px rgba(16, 33, 61, 0.08)",
        soft: "0 10px 35px rgba(36, 87, 214, 0.12)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
