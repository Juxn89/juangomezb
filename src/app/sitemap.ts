import {MetadataRoute} from 'next';
import {routing} from '@/routing';
import {getSiteUrl} from '@/lib/constants/site';
import {parseProjects} from '@/lib/projects/get-projects';
import messages from '../../messages/en.json';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = getSiteUrl();

	// Slugs are identical in every locale (messages-parity.test.ts), so one locale lists them all.
	const projectRoutes = parseProjects(messages.projects.items).map(({slug}) => `/projects/${slug}`);
	const routes = ['', '/projects', ...projectRoutes];

	return routes.flatMap((route) =>
		routing.locales.map((locale) => ({
			url: `${baseUrl}/${locale}${route}`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: route === '' ? 1.0 : 0.8,
			alternates: {
				languages: Object.fromEntries(routing.locales.map((alt) => [alt, `${baseUrl}/${alt}${route}`])),
			},
		}))
	);
}
