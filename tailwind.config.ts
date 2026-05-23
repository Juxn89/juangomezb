import type {Config} from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
				'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
				'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
				'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
				'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
				'accent-secondary': 'rgb(var(--color-accent-secondary) / <alpha-value>)',
				'accent-tertiary': 'rgb(var(--color-accent-tertiary) / <alpha-value>)',
				border: 'rgb(var(--color-border) / <alpha-value>)',
				success: 'rgb(var(--color-success) / <alpha-value>)',
				warning: 'rgb(var(--color-warning) / <alpha-value>)',
				error: 'rgb(var(--color-error) / <alpha-value>)',
				info: 'rgb(var(--color-info) / <alpha-value>)',
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-geist-mono)', 'monospace'],
			},
		},
	},
	plugins: [],
};

export default config;
