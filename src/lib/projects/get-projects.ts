import {getTranslations} from 'next-intl/server';
import {FEATURED_PROJECTS_LIMIT} from '@/lib/constants/site';
import {projectSchema} from './schema';
import type {Project} from './types';

/**
 * Validates the raw `projects.items` messages. An entry that fails is dropped and reported instead of
 * reaching a component as `undefined`; a duplicate slug keeps the first entry, since slugs are routes.
 */
export function parseProjects(raw: unknown): Project[] {
	if (!Array.isArray(raw)) {
		console.warn('projects.items is not an array; no projects will be shown');
		return [];
	}

	const projects: Project[] = [];
	const seen = new Set<string>();

	raw.forEach((entry, index) => {
		const result = projectSchema.safeParse(entry);
		if (!result.success) {
			console.warn(`projects.items[${index}] is invalid and was skipped`, result.error.issues);
			return;
		}
		if (seen.has(result.data.slug)) {
			console.warn(`projects.items[${index}] repeats the slug "${result.data.slug}" and was skipped`);
			return;
		}
		seen.add(result.data.slug);
		projects.push(result.data);
	});

	return projects;
}

export function selectFeatured(projects: Project[], limit: number = FEATURED_PROJECTS_LIMIT): Project[] {
	return projects.filter((project) => project.featured).slice(0, limit);
}

export async function getProjects(locale: string): Promise<Project[]> {
	const t = await getTranslations({locale, namespace: 'projects'});
	return parseProjects(t.raw('items'));
}

export async function getFeaturedProjects(locale: string, limit?: number): Promise<Project[]> {
	return selectFeatured(await getProjects(locale), limit);
}

export async function getProjectBySlug(locale: string, slug: string): Promise<Project | undefined> {
	return (await getProjects(locale)).find((project) => project.slug === slug);
}
