import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
	poweredByHeader: false,
	// /api/download-cv reads the CVs from disk: ship the current ones with the function, never the old ones.
	outputFileTracingIncludes: {
		'/api/download-cv': ['./public/resume/juan-gomez-cv-*.pdf'],
	},
	outputFileTracingExcludes: {
		'/api/download-cv': ['./public/resume/previous/**'],
	},
	experimental: {
		// The root layout is app/[locale]/layout.tsx; app/global-not-found.tsx serves URLs no route matches.
		globalNotFound: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'media2.dev.to',
			},
			{
				protocol: 'https',
				hostname: 'dev-to-uploads.s3.amazonaws.com',
			},
		],
	},
};

export default withNextIntl(nextConfig);
