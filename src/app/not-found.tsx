export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<div className="text-center">
				<h1 className="text-9xl font-bold gradient-text">404</h1>
				<h2 className="mt-4 text-3xl font-bold text-text-primary">Page not found</h2>
				<p className="mt-4 text-lg text-text-secondary">
					The page you're looking for doesn't exist.
				</p>
				<a
					href="/en"
					className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg font-medium hover:opacity-90 transition-all"
				>
					Go to Home
				</a>
			</div>
		</div>
	);
}
