import {test, expect} from '@playwright/test';
import {revealHeaderControls} from '../helpers/header';

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

	test('clicking nav link scrolls to the correct section', async ({page, isMobile}) => {
		await revealHeaderControls(page, isMobile);
		// Exact name: the hero's scroll indicator is "Scroll to About section". Visible only: the desktop
		// and mobile menus both render the link.
		await page.getByRole('link', {name: 'About', exact: true}).filter({visible: true}).click();
		await page.waitForTimeout(600);
		const aboutSection = page.locator('#about');
		await expect(aboutSection).toBeInViewport();
	});

	test('dark mode toggle adds dark class to html element', async ({page, isMobile}) => {
		// The theme selector has three buttons (Light Mode, Dark Mode, System); start from a light system theme.
		await page.emulateMedia({colorScheme: 'light'});
		await revealHeaderControls(page, isMobile);
		const html = page.locator('html');

		await page.getByRole('button', {name: 'Dark Mode'}).filter({visible: true}).click();
		await expect(html).toHaveClass(/\bdark\b/);

		await page.getByRole('button', {name: 'Light Mode'}).filter({visible: true}).click();
		await expect(html).not.toHaveClass(/\bdark\b/);
	});

	test('mobile: hamburger menu opens and shows nav links', async ({page}) => {
		await page.setViewportSize({width: 375, height: 812});
		const menuButton = page.getByRole('button', {name: /menu|open navigation/i});
		await menuButton.click();
		await expect(page.getByRole('link', {name: 'About'})).toBeVisible();
	});
});
