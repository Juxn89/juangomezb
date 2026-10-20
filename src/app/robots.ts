import {MetadataRoute} from 'next';
import {getSiteUrl} from '@/lib/constants/site';

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getSiteUrl();

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/', '/_next/', '/private/'],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
