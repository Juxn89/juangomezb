import {test, expect} from '@playwright/test';

test.describe('Navigation', () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/en');
	});

	test('header is visible on page load', async ({page}) => {
		await expect(page.getByRole('navigation')).toBeVisible();
	});

	test('header remains visible after scrolling down', async ({page}) => {
		await page.evaluate(() => window.scrollTo(0, 800));
		await page.waitForTimeout(300);
		await expect(page.getByRole('navigation')).toBeVisible();
	});

	test('clicking nav link scrolls to the correct section', async ({page}) => {
		await page.getByRole('link', {name: 'About'}).click();
		await page.waitForTimeout(600);
		const aboutSection = page.locator('#about');
		await expect(aboutSection).toBeInViewport();
	});

	test('dark mode toggle adds dark class to html element', async ({page}) => {
		const html = page.locator('html');
		const initialClass = await html.getAttribute('class') ?? '';
		await page.getByRole('button', {name: /theme|dark|light/i}).click();
		const updatedClass = await html.getAttribute('class') ?? '';
		expect(updatedClass).not.toBe(initialClass);
	});

	test('mobile: hamburger menu opens and shows nav links', async ({page}) => {
		await page.setViewportSize({width: 375, height: 812});
		const menuButton = page.getByRole('button', {name: /menu|open navigation/i});
		await menuButton.click();
		await expect(page.getByRole('link', {name: 'About'})).toBeVisible();
	});
});
