import {describe, it, expect, vi, beforeEach} from 'vitest';
import {transformRepoToProject, getPinnedProjects} from './api';
import type {GitHubRepo} from './api';

// --- Fixtures ---

const makeRepo = (overrides: Partial<GitHubRepo> = {}): GitHubRepo => ({
	id: 'repo-1',
	name: 'my-cool-project',
	description: 'A cool project',
	url: 'https://github.com/user/my-cool-project',
	homepageUrl: 'https://my-cool-project.com',
	stargazerCount: 42,
	forkCount: 5,
	primaryLanguage: {name: 'TypeScript'},
	repositoryTopics: {
		nodes: [
			{topic: {name: 'nextjs'}},
			{topic: {name: 'react'}},
		],
	},
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2026-06-01T00:00:00Z',
	pushedAt: '2026-06-01T00:00:00Z',
	...overrides,
});

// --- transformRepoToProject ---

describe('transformRepoToProject', () => {
	it('formats the title from repo name (hyphens → spaces, capitalized)', () => {
		const project = transformRepoToProject(makeRepo({name: 'my-cool-project'}));
		expect(project.title).toBe('My Cool Project');
	});

	it('formats the title from repo name with underscores', () => {
		const project = transformRepoToProject(makeRepo({name: 'my_cool_project'}));
		expect(project.title).toBe('My Cool Project');
	});

	it('includes the primary language in technologies', () => {
		const project = transformRepoToProject(makeRepo());
		expect(project.technologies).toContain('TypeScript');
	});

	it('includes topics in technologies (up to 5)', () => {
		const project = transformRepoToProject(makeRepo());
		expect(project.technologies).toContain('nextjs');
		expect(project.technologies).toContain('react');
	});

	it('deduplicates technologies', () => {
		const repo = makeRepo({
			primaryLanguage: {name: 'TypeScript'},
			repositoryTopics: {nodes: [{topic: {name: 'TypeScript'}}]},
		});
		const project = transformRepoToProject(repo);
		const count = project.technologies.filter((t) => t === 'TypeScript').length;
		expect(count).toBe(1);
	});

	it('generates English highlights by default', () => {
		const project = transformRepoToProject(makeRepo({stargazerCount: 10}));
		expect(project.highlights.some((h) => h.includes('GitHub stars'))).toBe(true);
	});

	it('generates Spanish highlights when locale is es', () => {
		const project = transformRepoToProject(makeRepo({stargazerCount: 10}), 'es');
		expect(project.highlights.some((h) => h.includes('estrellas'))).toBe(true);
	});

	it('sets demoUrl to homepageUrl when available', () => {
		const project = transformRepoToProject(makeRepo({homepageUrl: 'https://demo.com'}));
		expect(project.demoUrl).toBe('https://demo.com');
	});

	it('falls back to repo url when no homepageUrl', () => {
		const project = transformRepoToProject(makeRepo({homepageUrl: null}));
		expect(project.demoUrl).toBe('https://github.com/user/my-cool-project');
	});

	it('uses fallback description when repo has none', () => {
		const project = transformRepoToProject(makeRepo({description: null}));
		expect(project.description).toBe('No description available');
	});

	it('uses Spanish fallback description when locale is es', () => {
		const project = transformRepoToProject(makeRepo({description: null}), 'es');
		expect(project.description).toBe('Sin descripción disponible');
	});

	it('marks all pinned repos as featured', () => {
		const project = transformRepoToProject(makeRepo());
		expect(project.featured).toBe(true);
	});

	it('sets stars from stargazerCount', () => {
		const project = transformRepoToProject(makeRepo({stargazerCount: 99}));
		expect(project.stars).toBe(99);
	});
});

// --- getPinnedProjects ---

describe('getPinnedProjects', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns projects sorted by stars descending', async () => {
		const repos = [
			makeRepo({id: 'a', name: 'low-stars', stargazerCount: 1}),
			makeRepo({id: 'b', name: 'high-stars', stargazerCount: 100}),
			makeRepo({id: 'c', name: 'mid-stars', stargazerCount: 50}),
		];

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				data: {user: {pinnedItems: {nodes: repos}}},
			}),
		}));

		const projects = await getPinnedProjects('juxn89', 'en', 10);

		expect(projects[0]?.stars).toBe(100);
		expect(projects[1]?.stars).toBe(50);
		expect(projects[2]?.stars).toBe(1);
	});

	it('respects the limit', async () => {
		const repos = Array.from({length: 6}, (_, i) =>
			makeRepo({id: `repo-${i}`, name: `project-${i}`, stargazerCount: i})
		);

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				data: {user: {pinnedItems: {nodes: repos}}},
			}),
		}));

		const projects = await getPinnedProjects('juxn89', 'en', 2);

		expect(projects).toHaveLength(2);
	});

	it('returns empty array when fetch fails', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const projects = await getPinnedProjects('juxn89', 'en', 4);

		expect(projects).toEqual([]);
	});

	it('returns empty array when API responds with non-ok status', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
		}));

		const projects = await getPinnedProjects('juxn89', 'en', 4);

		expect(projects).toEqual([]);
	});
});
