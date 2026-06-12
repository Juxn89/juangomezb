import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {generateSEOMetadata, generatePersonSchema, generateWebSiteSchema} from './seo';

const BASE_URL = 'https://juangomezb.com';

beforeEach(() => {
	process.env['NEXT_PUBLIC_SITE_URL'] = BASE_URL;
});

afterEach(() => {
	delete process.env['NEXT_PUBLIC_SITE_URL'];
});

// --- generateSEOMetadata ---

describe('generateSEOMetadata', () => {
	it('builds a full title with name suffix', () => {
		const meta = generateSEOMetadata({title: 'Home', description: 'Desc', locale: 'en'});
		expect(String(meta.title)).toContain('Home');
		expect(String(meta.title)).toContain('Juan Carlos Gómez');
	});

	it('does not duplicate name when title already contains it', () => {
		const meta = generateSEOMetadata({
			title: 'Juan Gómez Portfolio',
			description: 'Desc',
			locale: 'en',
		});
		expect(String(meta.title)).toBe('Juan Gómez Portfolio');
	});

	it('sets canonical URL using locale and path', () => {
		const meta = generateSEOMetadata({
			title: 'Home',
			description: 'Desc',
			locale: 'en',
			path: '/about',
		});
		expect(meta.alternates?.canonical).toBe(`${BASE_URL}/en/about`);
	});

	it('sets hreflang alternates for both locales', () => {
		const meta = generateSEOMetadata({title: 'Home', description: 'Desc', locale: 'en', path: ''});
		expect(meta.alternates?.languages?.['en']).toBe(`${BASE_URL}/en`);
		expect(meta.alternates?.languages?.['es']).toBe(`${BASE_URL}/es`);
	});

	it('sets og:locale to en_US for English', () => {
		const meta = generateSEOMetadata({title: 'Home', description: 'Desc', locale: 'en'});
		expect((meta.openGraph as {locale?: string})?.locale).toBe('en_US');
	});

	it('sets og:locale to es_ES for Spanish', () => {
		const meta = generateSEOMetadata({title: 'Inicio', description: 'Desc', locale: 'es'});
		expect((meta.openGraph as {locale?: string})?.locale).toBe('es_ES');
	});
});

// --- generatePersonSchema ---

describe('generatePersonSchema', () => {
	it('returns a valid Person schema', () => {
		const schema = generatePersonSchema('en');
		expect(schema['@type']).toBe('Person');
		expect(schema['@context']).toBe('https://schema.org');
	});

	it('contains the correct name', () => {
		const schema = generatePersonSchema('en');
		expect(schema.name).toBe('Juan Carlos Gómez Bermúdez');
	});

	it('contains the site URL', () => {
		const schema = generatePersonSchema('en');
		expect(schema.url).toBe(BASE_URL);
	});

	it('contains at least one social link in sameAs', () => {
		const schema = generatePersonSchema('en');
		expect(schema.sameAs.length).toBeGreaterThan(0);
		expect(schema.sameAs.some((url) => url.includes('github'))).toBe(true);
	});
});

// --- generateWebSiteSchema ---

describe('generateWebSiteSchema', () => {
	it('returns a valid WebSite schema', () => {
		const schema = generateWebSiteSchema('en');
		expect(schema['@type']).toBe('WebSite');
		expect(schema['@context']).toBe('https://schema.org');
	});

	it('sets inLanguage to en-US for English', () => {
		const schema = generateWebSiteSchema('en');
		expect(schema.inLanguage).toBe('en-US');
	});

	it('sets inLanguage to es-ES for Spanish', () => {
		const schema = generateWebSiteSchema('es');
		expect(schema.inLanguage).toBe('es-ES');
	});

	it('contains the site URL', () => {
		const schema = generateWebSiteSchema('en');
		expect(schema.url).toBe(BASE_URL);
	});
});
