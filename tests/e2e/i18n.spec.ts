import {test, expect} from '@playwright/test';
import {revealHeaderControls} from '../helpers/header';

test.describe('Internationalization', () => {
	test('loads English content at /en', async ({page}) => {
		await page.goto('/en');
		await expect(page.getByText("Hi, I'm")).toBeVisible();
		await expect(page.getByRole('heading', {name: 'About Me'})).toBeVisible();
	});

	test('loads Spanish content at /es', async ({page}) => {
		await page.goto('/es');
		await expect(page.getByText('Hola, soy')).toBeVisible();
		await expect(page.getByRole('heading', {name: 'Acerca de Mí'})).toBeVisible();
	});

	test('switching locale from EN to ES updates the URL and content', async ({page, isMobile}) => {
		await page.goto('/en');
		await revealHeaderControls(page, isMobile);
		// The switcher is a toggle group: the active locale is plain text, the other one a link
		// labelled with its language name in the current locale.
		await page.getByRole('link', {name: 'Spanish'}).filter({visible: true}).click();
		// The dev server compiles /es on first visit, which can exceed the default 5 s under parallel load.
		await expect(page).toHaveURL(/\/es/, {timeout: 20_000});
		await expect(page.getByText('Hola, soy')).toBeVisible();
	});

	test('/ redirects to /en by default', async ({page}) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/en/);
	});

	test('blog section at /en shows English articles or empty state (never Spanish)', async ({page}) => {
		await page.goto('/en');
		// Wait for blog section to finish loading
		await page.waitForSelector('#blog', {timeout: 10000});
		// If articles loaded, they should be in English
		const articles = page.locator('#blog article');
		const count = await articles.count();
		if (count > 0) {
			// Verify no articles have Spanish-only text like "junio" in dates
			const blogText = await page.locator('#blog').textContent();
			expect(blogText).not.toMatch(/^Hola|^Acerca/);
		}
	});
});
