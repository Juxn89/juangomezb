'use client';

import {createContext, useCallback, useContext, useEffect, useSyncExternalStore, ReactNode} from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';
const THEME_CHANGE_EVENT = 'theme-change';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function isTheme(value: string | null): value is Theme {
	return value === 'light' || value === 'dark' || value === 'system';
}

// The stored choice and the system preference live outside React, so they are read with
// useSyncExternalStore: the server and the first client render agree on 'system', then the real
// value takes over, with no setState inside an effect.
function subscribeToStoredTheme(onChange: () => void) {
	window.addEventListener('storage', onChange); // other tabs
	window.addEventListener(THEME_CHANGE_EVENT, onChange); // this tab
	return () => {
		window.removeEventListener('storage', onChange);
		window.removeEventListener(THEME_CHANGE_EVENT, onChange);
	};
}

function readStoredTheme(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);
	return isTheme(stored) ? stored : 'system';
}

function subscribeToSystemTheme(onChange: () => void) {
	const query = window.matchMedia(DARK_QUERY);
	query.addEventListener('change', onChange);
	return () => query.removeEventListener('change', onChange);
}

const readSystemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;
const serverTheme = (): Theme => 'system';
const serverPrefersDark = () => false;

export function ThemeProvider({children}: {children: ReactNode}) {
	const theme = useSyncExternalStore(subscribeToStoredTheme, readStoredTheme, serverTheme);
	const prefersDark = useSyncExternalStore(subscribeToSystemTheme, readSystemPrefersDark, serverPrefersDark);
	const resolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

	const setTheme = useCallback((next: Theme) => {
		localStorage.setItem(STORAGE_KEY, next);
		window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
	}, []);

	// Sync the DOM and the SSR cookie with the current choice.
	useEffect(() => {
		document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
		document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
	}, [theme, resolvedTheme]);

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
