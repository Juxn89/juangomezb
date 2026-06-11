import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
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
