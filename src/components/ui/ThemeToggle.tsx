'use client';

import {useTheme} from '@/lib/context/theme-context';
import {Sun, Moon, Monitor} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

export function ThemeToggle() {
	const {theme, setTheme} = useTheme();
	const t = useTranslations('theme');
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const themes: Array<{value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string}> = [
		{value: 'light', icon: Sun, label: t('light')},
		{value: 'dark', icon: Moon, label: t('dark')},
		{value: 'system', icon: Monitor, label: t('system')},
	];

	if (!mounted) {
		return (
			<div className="inline-flex items-center gap-1 p-1 rounded-lg bg-bg-secondary border border-border">
				<div className="p-2 rounded-md">
					<Monitor className="w-4 h-4" />
				</div>
			</div>
		);
	}

	return (
		<div className="inline-flex items-center gap-1 p-1 rounded-lg bg-bg-secondary border border-border">
			{themes.map(({value, icon: Icon, label}) => (
				<button
					key={value}
					onClick={() => setTheme(value)}
					className={cn(
						'p-2 rounded-md transition-all duration-200',
						'hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary',
						theme === value
							? 'bg-accent-primary text-white shadow-md'
							: 'text-text-secondary hover:text-text-primary'
					)}
					aria-label={label}
					title={label}
				>
					<Icon className="w-4 h-4" />
				</button>
			))}
		</div>
	);
}
