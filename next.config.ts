import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
	poweredByHeader: false,
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
