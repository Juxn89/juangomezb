'use client';

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {AlertCircle} from 'lucide-react';

export default function Error({
	error,
	reset,
}: {
	error: Error & {digest?: string};
	reset: () => void;
}) {
	const t = useTranslations('error');

	useEffect(() => {
		// Log error to monitoring service in production
		console.error('Error caught by boundary:', error);
	}, [error]);

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-tertiary/10 mb-6">
					<AlertCircle className="w-10 h-10 text-accent-tertiary" />
				</div>
				
				<h1 className="text-4xl font-bold text-text-primary mb-4">
					{t('title')}
				</h1>
				
				<p className="text-lg text-text-secondary mb-8">
					{t('message')}
				</p>

				{error.digest && (
					<p className="text-sm text-text-secondary/70 mb-8 font-mono">
						Error ID: {error.digest}
					</p>
				)}

				<button
					onClick={reset}
					className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-accent-primary px-6 py-3 text-base font-bold text-white shadow-lg shadow-accent-primary/30 transition-all hover:shadow-xl hover:shadow-accent-primary/40 hover:scale-105 active:scale-95"
				>
					{t('tryAgain')}
				</button>
			</div>
		</div>
	);
}
