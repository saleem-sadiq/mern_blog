import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // Import plugin with ES Module syntax
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		screens: {
  			xs: '360px',
  			sm: '500px',
  			md: '640px',
  			lg: '768px',
  			lg2: '850px',
  			xl: '1024px',
  			'2xl': '1280px',
  			'3xl': '1430px',
  			'4xl': '1920px',
  			'5xl': '2200px'
  		},
  		fontSize: {
  			'8': '0.5rem',
  			'9': '0.563rem',
  			'10': '0.625rem',
  			'11': '0.688rem',
  			'13': '0.813rem',
  			'14': '0.875rem',
  			'16': '1rem',
  			'18': '1.125rem',
  			'21': '1.313rem',
  			'22': '1.375rem',
  			'24': '1.5rem',
  			'26': '1.563rem',
  			'28': '1.75rem',
  			'32': '2rem',
  			'34': '2.125rem',
  			'36': '2.25rem',
  			'42': '2.625rem',
  			'70': '4.375rem',
  			h1: '4rem',
  			'56': '3.5rem',
  			h2: '2.875rem'
  		},
  		colors: {
  			default: '#000051',
  			default100: '#d3e3fd',
  			whitefade: '#fff8eb',
  			default500: '#2860E1',
  			blackfade: '#232122',
  			blackfade2: '#212121',
  			textgrey: '#A4A5A5',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [tailwindcssAnimate, typography], // Using the ES import for the plugin
};

export default config;
