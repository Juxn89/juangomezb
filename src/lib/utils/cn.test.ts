import {describe, it, expect} from 'vitest';
import {cn} from './cn';

describe('cn', () => {
	it('returns a single class unchanged', () => {
		expect(cn('text-sm')).toBe('text-sm');
	});

	it('joins multiple classes', () => {
		expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
	});

	it('resolves conflicting Tailwind classes — last one wins', () => {
		expect(cn('text-sm', 'text-lg')).toBe('text-lg');
		expect(cn('p-4', 'p-8')).toBe('p-8');
		expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
	});

	it('ignores falsy values', () => {
		expect(cn('text-sm', false, undefined, null, '')).toBe('text-sm');
	});

	it('handles conditional classes via objects', () => {
		expect(cn({'font-bold': true, 'font-normal': false})).toBe('font-bold');
	});

	it('handles arrays of classes', () => {
		expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold');
	});

	it('returns empty string when no valid classes provided', () => {
		expect(cn(false, undefined, null)).toBe('');
	});
});
