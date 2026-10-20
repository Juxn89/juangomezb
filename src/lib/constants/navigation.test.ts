import {describe, it, expect} from 'vitest';
import {sectionForPath, sectionHref} from './navigation';

describe('sectionHref', () => {
	it('is a same-page anchor on the home page', () => {
		expect(sectionHref('about', 'en', true)).toBe('#about');
	});

	it('goes back to the localized home page from anywhere else', () => {
		expect(sectionHref('about', 'es', false)).toBe('/es#about');
	});
});

describe('sectionForPath', () => {
	it('marks the projects section on the index and on every case study', () => {
		expect(sectionForPath('/projects')).toBe('projects');
		expect(sectionForPath('/projects/docs-assistant')).toBe('projects');
	});

	it('marks nothing on unrelated pages', () => {
		expect(sectionForPath('/projectsx')).toBeNull();
		expect(sectionForPath('/no-such-page')).toBeNull();
	});
});
