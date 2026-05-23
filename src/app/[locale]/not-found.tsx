import {useTranslations} from 'next-intl';
import {Link} from '@/routing';
import {FileQuestion} from 'lucide-react';

export default function NotFound() {
	const t = useTranslations('common');

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/10 mb-6">
					<FileQuestion className="w-10 h-10 text-accent-primary" />
				</div>
				
				<h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
				
				<h2 className="text-3xl font-bold text-text-primary mb-4">
					{t('notFound')}
				</h2>
				
				<p className="text-lg text-text-secondary mb-8">
					The page you're looking for doesn't exist.
				</p>
				
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-accent-primary px-6 py-3 text-base font-bold text-white shadow-lg shadow-accent-primary/30 transition-all hover:shadow-xl hover:shadow-accent-primary/40 hover:scale-105 active:scale-95"
				>
					{t('backHome')}
				</Link>
			</div>
		</div>
	);
}
