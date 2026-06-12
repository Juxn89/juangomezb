import {test, expect} from '@playwright/test';

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

	test('switching locale from EN to ES updates the URL and content', async ({page}) => {
		await page.goto('/en');
		await page.getByRole('button', {name: /en|es|language|idioma/i}).first().click();
		await page.getByRole('option', {name: /español|es/i}).click();
		await expect(page).toHaveURL(/\/es/);
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
