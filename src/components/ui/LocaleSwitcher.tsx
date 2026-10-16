'use client';

import {Link, routing, usePathname} from '@/routing';
import {useTranslations, useLocale} from 'next-intl';
import {ToggleGroup} from './ToggleGroup';
import {cn} from '@/lib/utils/cn';

export function LocaleSwitcher() {
	// next-intl's usePathname has no locale prefix; Link adds the target one.
	const pathname = usePathname();
	const locale = useLocale();
	const t = useTranslations('language');

	const locales = routing.locales.map((loc) => ({
		value: loc,
		label: loc === 'en' ? t('english') : t('spanish'),
		flag: loc === 'en' ? '🇺🇸' : '🇪🇸',
	}));

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
							aria-current={true}
						>
							<span className="text-base">{flag}</span>
							<span className="font-semibold">{value.toUpperCase()}</span>
						</div>
					);
				}

				return (
					<Link
						key={value}
						href={pathname}
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
