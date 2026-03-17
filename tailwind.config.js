/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          muted: "hsl(var(--sidebar-muted))",
          accent: "hsl(var(--sidebar-accent))",
          border: "hsl(var(--sidebar-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        card: "0 2px 8px -2px rgb(0 0 0 / 0.06), 0 4px 12px -4px rgb(0 0 0 / 0.04)",
        elevated: "0 8px 24px -4px rgb(0 0 0 / 0.08), 0 4px 12px -2px rgb(0 0 0 / 0.04)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.12), 0 0 20px -4px hsl(var(--primary) / 0.08)",
        "card-soft": "0 2px 12px -4px rgb(0 0 0 / 0.06)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 85% 55%) 100%)",
        "gradient-sidebar": "linear-gradient(135deg, hsl(224 76% 42%) 0%, hsl(262 60% 45%) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
