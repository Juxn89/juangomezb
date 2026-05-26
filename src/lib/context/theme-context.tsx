'use client';

import {createContext, useContext, useEffect, useState, ReactNode} from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: {children: ReactNode}) {
	const [theme, setTheme] = useState<Theme>('system');
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
	const [mounted, setMounted] = useState(false);

	// Load theme from localStorage on mount
	useEffect(() => {
		const storedTheme = localStorage.getItem('theme') as Theme | null;
		if (storedTheme) {
			setTheme(storedTheme);
		} else {
			// Detect system preference
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setResolvedTheme(prefersDark ? 'dark' : 'light');
		}
		setMounted(true);
	}, []);

	// Apply theme to document
	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;
		let newResolvedTheme: 'light' | 'dark' = 'light';

		if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			newResolvedTheme = prefersDark ? 'dark' : 'light';
		} else {
			newResolvedTheme = theme;
		}

		setResolvedTheme(newResolvedTheme);

		// Apply or remove dark class
		if (newResolvedTheme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		// Store in localStorage
		localStorage.setItem('theme', theme);

		// Set cookie for SSR
		document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
	}, [theme, mounted]);

	// Listen to system theme changes
	useEffect(() => {
		if (theme !== 'system') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			setResolvedTheme(e.matches ? 'dark' : 'light');
			const root = document.documentElement;
			if (e.matches) {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{theme, setTheme, resolvedTheme}}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
}
