'use client';

import {usePathname} from '@/routing';
import {routing} from '@/routing';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils/cn';

export function LocaleSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations('language');

	const locales = routing.locales.map((locale) => ({
		value: locale,
		label: locale === 'en' ? t('english') : t('spanish'),
		flag: locale === 'en' ? '🇺🇸' : '🇪🇸',
	}));

	const handleLocaleChange = (newLocale: string) => {
		// Remove the current locale from pathname
		const pathnameWithoutLocale = pathname.replace(/^\/[^\/]+/, '');
		// Navigate to the same page with new locale
		router.push(`/${newLocale}${pathnameWithoutLocale}`);
	};

	return (
		<div className="inline-flex items-center gap-1 p-1 rounded-lg bg-bg-secondary border border-border">
			{locales.map(({value, label, flag}) => {
				// Get current locale from pathname
				const currentLocale = pathname.split('/')[1] || 'en';
				const isActive = currentLocale === value;

				return (
					<button
						key={value}
						onClick={() => handleLocaleChange(value)}
						className={cn(
							'px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium',
							'hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary',
							'flex items-center gap-2',
							isActive
								? 'bg-accent-primary text-white shadow-md'
								: 'text-text-secondary hover:text-text-primary'
						)}
						aria-label={label}
						title={label}
					>
						<span>{flag}</span>
						<span>{value.toUpperCase()}</span>
					</button>
				);
			})}
		</div>
	);
}
