import {useTranslations} from 'next-intl';

export default function Home() {
	const t = useTranslations('hero');

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold">
					{t('greeting')} <span className="text-accent-primary">{t('name')}</span>
				</h1>
				<p className="mt-4 text-xl text-text-secondary">{t('title')}</p>
				<p className="mt-6 max-w-2xl text-text-secondary">{t('description')}</p>
			</div>
		</div>
	);
}
