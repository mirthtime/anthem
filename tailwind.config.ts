import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
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
					glow: "hsl(var(--primary-glow))",
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
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
				display: ["Outfit", "system-ui", "sans-serif"],
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
				"fade-in": {
					from: { opacity: "0", transform: "translateY(20px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in": {
					from: { transform: "translateX(-100%)" },
					to: { transform: "translateX(0)" },
				},
				shine: {
					"0%": { transform: "translateX(-100%) rotate(45deg)" },
					"100%": { transform: "translateX(300%) rotate(45deg)" },
				},
				glow: {
					"0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
					"50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.4)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				shimmer: {
					"0%, 100%": { backgroundPosition: "200% 0" },
					"50%": { backgroundPosition: "-200% 0" },
				},
				"gradient-shift": {
					"0%, 100%": { backgroundPosition: "0% 0%, 100% 0%, 50% 100%" },
					"33%": { backgroundPosition: "100% 50%, 0% 100%, 0% 0%" },
					"66%": { backgroundPosition: "50% 100%, 50% 0%, 100% 50%" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.6s ease-out",
				"slide-in": "slide-in 0.4s ease-out",
				shine: "shine 0.8s ease-out",
				glow: "glow 2s ease-in-out infinite alternate",
				float: "float 6s ease-in-out infinite",
				shimmer: "shimmer 3s ease-in-out infinite",
				"gradient-shift": "gradient-shift 20s ease infinite",
			},
			backgroundImage: {
				"gradient-primary": "var(--gradient-primary)",
				"gradient-sunset": "var(--gradient-sunset)",
				"gradient-card": "var(--gradient-card)",
				"gradient-premium": "var(--gradient-premium)",
			},
			boxShadow: {
				elegant: "var(--shadow-elegant)",
				glow: "var(--shadow-glow)",
				card: "var(--shadow-card)",
				"card-hover": "var(--shadow-card-hover)",
				intense: "var(--shadow-intense)",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;