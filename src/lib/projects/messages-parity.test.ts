import {describe, it, expect} from 'vitest';
import en from '../../../messages/en.json';
import es from '../../../messages/es.json';
import {parseProjects} from './get-projects';

/** Every key path in a messages tree, with arrays reduced to their length so a missing item shows up. */
function shape(value: unknown, path = ''): string[] {
	if (Array.isArray(value)) {
		return [`${path}[${value.length}]`, ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))];
	}
	if (value !== null && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, child]) => shape(child, path ? `${path}.${key}` : key));
	}
	return [path];
}

describe('messages parity', () => {
	it('en and es have the same keys and the same array lengths', () => {
		expect(shape(es)).toEqual(shape(en));
	});

	it('every project in both locales passes validation', () => {
		expect(parseProjects(en.projects.items)).toHaveLength(en.projects.items.length);
		expect(parseProjects(es.projects.items)).toHaveLength(es.projects.items.length);
	});

	it('projects share slug, order and every non-translated field across locales', () => {
		const pick = (items: typeof en.projects.items) =>
			items.map(({slug, kind, status, featured, year, repoUrl, stack, video}) => ({
				slug,
				kind,
				status,
				featured,
				year,
				repoUrl,
				stack,
				video: video && {src: video.src, poster: video.poster},
			}));
		expect(pick(es.projects.items)).toEqual(pick(en.projects.items));
	});
});
