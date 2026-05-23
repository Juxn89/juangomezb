'use client';

import {useEffect} from 'react';
import {AlertCircle} from 'lucide-react';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & {digest?: string};
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Global error caught:', error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="flex min-h-screen items-center justify-center px-4 bg-bg-primary">
					<div className="text-center max-w-md">
						<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-tertiary/10 mb-6">
							<AlertCircle className="w-10 h-10 text-accent-tertiary" />
						</div>
						
						<h1 className="text-4xl font-bold text-text-primary mb-4">
							Something went wrong!
						</h1>
						
						<p className="text-lg text-text-secondary mb-8">
							A critical error occurred. Please try refreshing the page.
						</p>

						{error.digest && (
							<p className="text-sm text-text-secondary/70 mb-8 font-mono">
								Error ID: {error.digest}
							</p>
						)}

						<button
							onClick={reset}
							className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-accent-primary px-6 py-3 text-base font-bold text-white shadow-lg shadow-accent-primary/30 transition-all hover:shadow-xl hover:shadow-accent-primary/40"
						>
							Try Again
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
