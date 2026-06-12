import {describe, it, expect, vi, beforeEach} from 'vitest';
import {formatArticleDate, getDevToArticles} from './devto';
import type {DevToArticle} from './devto';

// --- Fixtures ---

const makeArticle = (overrides: Partial<DevToArticle> = {}): DevToArticle => ({
	id: 1,
	title: 'Test Article',
	description: 'A test article',
	url: 'https://dev.to/test/article',
	published_at: '2026-06-10T21:20:58Z',
	cover_image: null,
	tag_list: ['typescript', 'nextjs'],
	reading_time_minutes: 5,
	public_reactions_count: 10,
	comments_count: 2,
	published_timestamp: '2026-06-10T21:20:58Z',
	slug: 'test-article',
	language: 'en',
	...overrides,
});

const enArticle = makeArticle({id: 1, title: 'English Article', language: 'en'});
const esArticle = makeArticle({id: 2, title: 'Spanish Article', language: 'es'});

// --- formatArticleDate ---

describe('formatArticleDate', () => {
	it('formats a date in English', () => {
		const result = formatArticleDate('2026-06-10T21:20:58Z', 'en');
		expect(result).toContain('2026');
		expect(result).toMatch(/June|Jun/);
	});

	it('formats a date in Spanish', () => {
		const result = formatArticleDate('2026-06-10T21:20:58Z', 'es');
		expect(result).toContain('2026');
		expect(result).toMatch(/junio|jun/i);
	});

	it('defaults to English when no locale provided', () => {
		const result = formatArticleDate('2026-06-10T21:20:58Z');
		expect(result).toMatch(/June|Jun/);
	});
});

// --- getDevToArticles ---

describe('getDevToArticles', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns only English articles when locale is en', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			json: async () => [enArticle, esArticle],
		}));

		const result = await getDevToArticles('jgomezdev', 'en', 6);

		expect(result).toHaveLength(1);
		expect(result[0]?.language).toBe('en');
	});

	it('returns only Spanish articles when locale is es', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			json: async () => [enArticle, esArticle],
		}));

		const result = await getDevToArticles('jgomezdev', 'es', 6);

		expect(result).toHaveLength(1);
		expect(result[0]?.language).toBe('es');
	});

	it('respects the limit after filtering', async () => {
		const manyEnArticles = Array.from({length: 10}, (_, i) =>
			makeArticle({id: i, language: 'en', title: `Article ${i}`})
		);

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			json: async () => manyEnArticles,
		}));

		const result = await getDevToArticles('jgomezdev', 'en', 3);

		expect(result).toHaveLength(3);
	});

	it('returns empty array when API responds with non-ok status', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error',
		}));

		const result = await getDevToArticles('jgomezdev', 'en', 6);

		expect(result).toEqual([]);
	});

	it('returns empty array when fetch throws', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

		const result = await getDevToArticles('jgomezdev', 'en', 6);

		expect(result).toEqual([]);
	});

	it('excludes articles with null published_at', async () => {
		const unpublished = makeArticle({id: 3, language: 'en', published_at: null as unknown as string});

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true,
			json: async () => [enArticle, unpublished],
		}));

		const result = await getDevToArticles('jgomezdev', 'en', 6);

		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe(enArticle.id);
	});
});
