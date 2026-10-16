import {describe, it, expect, vi, beforeEach} from 'vitest';
import {parseProjects, selectFeatured} from './get-projects';

vi.mock('next-intl/server', () => ({getTranslations: vi.fn()}));

function project(overrides: Record<string, unknown> = {}) {
	return {
		slug: 'docs-assistant',
		kind: 'oss',
		status: 'live',
		featured: true,
		year: '2026',
		role: 'Design and development',
		title: 'docs-assistant',
		tagline: 'Answers from your documents',
		description: 'An embeddable RAG chatbot',
		metrics: [{value: '98%', label: 'hit@5'}],
		stack: ['.NET 10'],
		repoUrl: 'https://github.com/Juxn89/docs-assistant',
		...overrides,
	};
}

beforeEach(() => {
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('parseProjects', () => {
	it('keeps valid entries in their original order', () => {
		const parsed = parseProjects([project({slug: 'b'}), project({slug: 'a'})]);
		expect(parsed.map((p) => p.slug)).toEqual(['b', 'a']);
	});

	it('drops an invalid entry and keeps the rest', () => {
		const parsed = parseProjects([project({slug: 'ok'}), project({slug: 'broken', metrics: []})]);
		expect(parsed.map((p) => p.slug)).toEqual(['ok']);
		expect(console.warn).toHaveBeenCalledOnce();
	});

	it('rejects placeholder links such as "#"', () => {
		expect(parseProjects([project({demoUrl: '#'})])).toEqual([]);
		expect(parseProjects([project({repoUrl: 'http://insecure.example'})])).toEqual([]);
	});

	it('accepts site paths for the video and its poster', () => {
		const video = {src: '/projects/x/demo.mp4', poster: '/projects/x/poster.jpg', caption: 'Demo'};
		expect(parseProjects([project({video})])[0]?.video).toEqual(video);
		expect(parseProjects([project({video: {...video, src: '//evil.example/x.mp4'}})])).toEqual([]);
	});

	it('rejects slugs that are not kebab-case, since they become routes', () => {
		expect(parseProjects([project({slug: 'Docs Assistant'})])).toEqual([]);
		expect(parseProjects([project({slug: '../etc'})])).toEqual([]);
	});

	it('keeps the first entry when two share a slug', () => {
		const parsed = parseProjects([project({title: 'first'}), project({title: 'second'})]);
		expect(parsed).toHaveLength(1);
		expect(parsed[0]?.title).toBe('first');
	});

	it('returns no projects when the messages are not an array', () => {
		expect(parseProjects(undefined)).toEqual([]);
		expect(parseProjects({items: []})).toEqual([]);
	});
});

describe('selectFeatured', () => {
	it('keeps only featured projects, up to the limit', () => {
		const projects = parseProjects([
			project({slug: 'a'}),
			project({slug: 'b', featured: false}),
			project({slug: 'c'}),
			project({slug: 'd'}),
		]);
		expect(selectFeatured(projects, 2).map((p) => p.slug)).toEqual(['a', 'c']);
		expect(selectFeatured(projects).map((p) => p.slug)).toEqual(['a', 'c', 'd']);
	});
});
