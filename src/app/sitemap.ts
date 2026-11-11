import {MetadataRoute} from 'next';
import {routing} from '@/routing';
import {getSiteUrl} from '@/lib/constants/site';
import {getProjects} from '@/lib/projects/get-projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getSiteUrl();

	// Slugs are identical in every locale (messages-parity.test.ts), so one locale lists them all.
	const projectRoutes = (await getProjects(routing.defaultLocale)).map(({slug}) => `/projects/${slug}`);
	const routes = ['', '/projects', ...projectRoutes];

	return routes.flatMap((route) =>
		routing.locales.map((locale) => ({
			url: `${baseUrl}/${locale}${route}`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: route === '' ? 1.0 : 0.8,
			alternates: {
				languages: {
					...Object.fromEntries(routing.locales.map((alt) => [alt, `${baseUrl}/${alt}${route}`])),
					'x-default': `${baseUrl}/${routing.defaultLocale}${route}`,
				},
			},
		}))
	);
}
