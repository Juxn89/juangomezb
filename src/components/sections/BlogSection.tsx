import {getTranslations} from 'next-intl/server';
import {getDevToArticles} from '@/lib/api/devto';
import {BlogCard} from './BlogCard';
import {Suspense} from 'react';

// Loading skeleton component
function BlogSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div
					key={i}
					className="rounded-2xl bg-bg-secondary border border-border overflow-hidden animate-pulse"
				>
					<div className="w-full h-48 bg-bg-tertiary" />
					<div className="p-6 space-y-4">
						<div className="flex gap-2">
							<div className="h-6 w-16 bg-bg-tertiary rounded-full" />
							<div className="h-6 w-20 bg-bg-tertiary rounded-full" />
						</div>
						<div className="h-6 w-3/4 bg-bg-tertiary rounded" />
						<div className="space-y-2">
							<div className="h-4 w-full bg-bg-tertiary rounded" />
							<div className="h-4 w-5/6 bg-bg-tertiary rounded" />
						</div>
						<div className="h-8 w-32 bg-bg-tertiary rounded-lg" />
					</div>
				</div>
			))}
		</div>
	);
}

// Blog content component (async Server Component)
async function BlogContent() {
	const articles = await getDevToArticles('jgomezdev', 6);

	if (articles.length === 0) {
		return (
			<div className="text-center py-16">
				<p className="text-text-secondary text-lg">No articles found.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{articles.map((article, index) => (
				<BlogCard key={article.id} article={article} index={index} />
			))}
		</div>
	);
}

// Main Blog Section (Server Component)
export async function BlogSection() {
	const t = await getTranslations('blog');

	return (
		<section id="blog" className="relative py-20 px-4 overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent-tertiary/10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto max-w-7xl">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4 pb-1 leading-tight">
						{t('title')}
					</h2>
					<p className="text-text-secondary text-lg max-w-2xl mx-auto">
						{t('subtitle')}
					</p>
				</div>

				{/* Articles Grid */}
				<Suspense fallback={<BlogSkeleton />}>
					<BlogContent />
				</Suspense>

				{/* View All Link */}
				<div className="text-center mt-12">
					<a
						href="https://dev.to/jgomezdev"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors"
					>
						View All Articles on Dev.to
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M7.73 11.93c0 1.72 1.71 1.71 1.71 1.71h.29v-3.37h-.29c-.26 0-.44.07-.58.23-.13.16-.2.38-.2.67v.76zm-1.7 0c0-.59.13-1.06.38-1.41.25-.35.6-.53 1.06-.53h.93v6.07H6.03v-4.13zm6.33-.96h-1.28v1.3h1.28c.44 0 .65-.21.65-.65 0-.43-.21-.65-.65-.65zm.67 2.4l1.35 2.28h-2.39l-1.16-2.1v2.1h-2.37V9.01h3.97c.41 0 .77.09 1.08.27.31.18.54.43.71.75.16.32.24.67.24 1.07 0 .61-.18 1.09-.53 1.44-.36.35-.84.53-1.45.53h-.45zm-7.03 6.64c-.78.04-1.41-.24-1.86-.81-.44-.56-.67-1.34-.67-2.32s.23-1.76.67-2.32c.45-.57 1.08-.85 1.86-.81 1.17.06 1.76.96 1.76 2.69v.08c0 1.73-.59 2.63-1.76 2.69zm-1.85-7.01H1.51C.67 13 0 13.67 0 14.51v5.02c0 .84.67 1.51 1.51 1.51H3.9c.84 0 1.51-.67 1.51-1.51v-.63c0-.84-.67-1.51-1.51-1.51h-.78v-1.33h.78c.84 0 1.51-.67 1.51-1.51v-.63c0-.84-.67-1.51-1.51-1.51z"/>
						</svg>
					</a>
				</div>
			</div>
		</section>
	);
}
