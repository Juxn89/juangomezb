'use client';

import {useTheme} from '@/lib/context/theme-context';
import {Sun, Moon, Monitor} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {ToggleGroup, ToggleItem} from './ToggleGroup';

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
			<ToggleGroup>
				<div className="px-3 py-1.5">
					<Monitor className="w-4 h-4" />
				</div>
			</ToggleGroup>
		);
	}

	return (
		<ToggleGroup>
			{themes.map(({value, icon: Icon, label}) => (
				<ToggleItem
					key={value}
					active={theme === value}
					onClick={() => setTheme(value)}
					aria-label={label}
					title={label}
				>
					<Icon className="w-4 h-4" />
				</ToggleItem>
			))}
		</ToggleGroup>
	);
}
