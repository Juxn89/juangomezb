export type Particle = {
	id: number;
	x: number;
	y: number;
	delay: number;
	duration: number;
};

/** A repeatable value in [0, 1) for a given seed: the same on the server and in the browser. */
function noise(seed: number): number {
	const value = Math.sin(seed * 12.9898) * 43758.5453;
	return value - Math.floor(value);
}

/**
 * Positions and timings for decorative particles. Deterministic on purpose: Math.random() during render
 * gives the server and the browser different positions, which React reports as a hydration mismatch.
 */
export function createParticles(count: number): Particle[] {
	return Array.from({length: count}, (_, i) => ({
		id: i,
		x: noise(i + 1) * 100,
		y: noise(i + 101) * 100,
		delay: noise(i + 201) * 2,
		duration: 3 + noise(i + 301) * 2,
	}));
}
