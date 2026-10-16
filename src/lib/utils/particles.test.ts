import {describe, it, expect} from 'vitest';
import {createParticles} from './particles';

describe('createParticles', () => {
	it('returns the same particles on every call, so server and browser render alike', () => {
		expect(createParticles(20)).toEqual(createParticles(20));
	});

	it('creates the requested number of particles with sequential ids', () => {
		const particles = createParticles(5);
		expect(particles.map((p) => p.id)).toEqual([0, 1, 2, 3, 4]);
	});

	it('keeps positions within the container and timings within their ranges', () => {
		for (const p of createParticles(50)) {
			expect(p.x).toBeGreaterThanOrEqual(0);
			expect(p.x).toBeLessThan(100);
			expect(p.y).toBeGreaterThanOrEqual(0);
			expect(p.y).toBeLessThan(100);
			expect(p.delay).toBeGreaterThanOrEqual(0);
			expect(p.delay).toBeLessThan(2);
			expect(p.duration).toBeGreaterThanOrEqual(3);
			expect(p.duration).toBeLessThan(5);
		}
	});

	it('spreads particles out instead of stacking them', () => {
		const positions = new Set(createParticles(20).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`));
		expect(positions.size).toBe(20);
	});
});
