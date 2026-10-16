import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	// The dev server compiles each route on first visit; under parallel workers that alone can take >30 s.
	timeout: 60_000,
	use: {
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},
	projects: [
		{name: 'chromium', use: {...devices['Desktop Chrome']}},
		{name: 'Mobile Chrome', use: {...devices['Pixel 5']}},
	],
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !process.env.CI,
	},
});
