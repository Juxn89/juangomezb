import {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com';
	const locales = ['en', 'es'];

	// Base routes that should be included in sitemap
	const routes = [''];

	// Generate sitemap entries for each locale
	const sitemapEntries: MetadataRoute.Sitemap = [];

	routes.forEach((route) => {
		locales.forEach((locale) => {
			sitemapEntries.push({
				url: `${baseUrl}/${locale}${route}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: route === '' ? 1.0 : 0.8,
				alternates: {
					languages: {
						en: `${baseUrl}/en${route}`,
						es: `${baseUrl}/es${route}`,
					},
				},
			});
		});
	});

	return sitemapEntries;
}
