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
        // Background colors
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        
        // Border colors
        border: "var(--color-border)",
        "border-soft": "var(--color-border-soft)",
        
        // Text colors
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        
        // Primary action colors
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-active": "var(--color-primary-active)",
        
        // Status colors
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",

        // Accent/Glow colors
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",

        // Interaction states
        "focus-ring": "var(--color-focus-ring)",
        "hover-bg": "var(--color-hover-bg)",
        "selected-bg": "var(--color-selected-bg)",
      },
    },
  },
  plugins: [],
};
export default config;
