import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "tint-1": "#E5F2E9",
        "tint-2": "#CAE4D3",
        "tint-3": "#B0D7BD",
        "tint-4": "#96C9A7",
        "tint-5": "#7CBC91",
        "tint-6": "#61AE7B",
        "tint-7": "#4E9968",
        "main": "#417F56",
        "shade-1": "#396F4B",
        "shade-2": "#315F41",
        "shade-3": "#294F36",
        "shade-4": "#21402B",
        "shade-5": "#183020",
        "shade-6": "#102016",
        "shade-7": "#08100B",
        white: "#FFFFFF",
        black: "#0C0C0C",
        error: "#C30000",
        "error-light": "#ED2E2E",
        "error-extra-light": "#FFF2F2",
        success: "#00966D",
        "success-light": "#00BA88",
        "success-extra-light": "#F3FDFA",
        warning: "#A9791C",
        "warning-light": "#F4B740",
        "warning-extra-light": "#FFF8E1",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      fontFamily: {
        'estedad': ['estedad']
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config