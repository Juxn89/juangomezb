'use client';

import {Link} from '@/routing';
import {routing} from '@/routing';
import {useTranslations, useLocale} from 'next-intl';
import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {ToggleGroup} from './ToggleGroup';
import {cn} from '@/lib/utils/cn';

export function LocaleSwitcher() {
	const pathname = usePathname();
	const locale = useLocale();
	const t = useTranslations('language');
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const locales = routing.locales.map((loc) => ({
		value: loc,
		label: loc === 'en' ? t('english') : t('spanish'),
		flag: loc === 'en' ? '🇺🇸' : '🇪🇸',
	}));

	// Get path without locale prefix for Link
	const getPathForLocale = (newLocale: string) => {
		const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
		return pathnameWithoutLocale === '/' ? '/' : pathnameWithoutLocale;
	};

	if (!mounted) {
		return (
			<ToggleGroup>
				<div className="px-3 py-1.5">
					<span>🌐</span>
				</div>
			</ToggleGroup>
		);
	}

	return (
		<ToggleGroup>
			{locales.map(({value, label, flag}) => {
				const isActive = locale === value;
				const baseClasses = cn(
					'px-3 py-1.5 rounded-md text-sm font-medium',
					'flex items-center justify-center gap-2 min-h-[32px]',
					'transition-all duration-300 ease-in-out',
					'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1'
				);

				if (isActive) {
					return (
						<div
							key={value}
							className={cn(
								baseClasses,
								'bg-accent-primary text-white shadow-md cursor-default'
							)}
							aria-current="true"
						>
							<span className="text-base">{flag}</span>
							<span className="font-semibold">{value.toUpperCase()}</span>
						</div>
					);
				}

				return (
					<Link
						key={value}
						href={getPathForLocale(value)}
						locale={value}
						className={cn(
							baseClasses,
							'text-text-secondary hover:text-text-primary',
							'hover:bg-bg-primary hover:scale-105 active:scale-95'
						)}
						aria-label={label}
						title={label}
					>
						<span className="text-base">{flag}</span>
						<span className="font-semibold">{value.toUpperCase()}</span>
					</Link>
				);
			})}
		</ToggleGroup>
	);
}
