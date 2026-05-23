'use client';

import {useTranslations, useLocale} from 'next-intl';

export default function Home() {
	const t = useTranslations('hero');
	const locale = useLocale();

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="text-center">
				<div className="mb-4 px-4 py-2 bg-bg-secondary rounded-lg inline-block">
					<span className="text-sm text-text-secondary">Current Locale: </span>
					<span className="text-sm font-bold text-accent-primary">{locale}</span>
				</div>
				<h1 className="text-4xl font-bold">
					{t('greeting')} <span className="text-accent-primary">{t('name')}</span>
				</h1>
				<p className="mt-4 text-xl text-text-secondary">{t('title')}</p>
				<p className="mt-6 max-w-2xl text-text-secondary">{t('description')}</p>
			</div>
		</div>
	);
}
