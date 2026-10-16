import {test, expect} from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({page}) => {
		await page.goto('/en');
	});

	test('hero section is visible with name and greeting', async ({page}) => {
		await expect(page.getByText("Hi, I'm")).toBeVisible();
		await expect(page.getByRole('heading', {name: 'Juan Gómez'})).toBeVisible();
	});

	test('profile photo is visible', async ({page}) => {
		const photo = page.getByRole('img', {name: 'Juan Gómez'});
		await expect(photo).toBeVisible();
	});

	test('about section is visible', async ({page}) => {
		await expect(page.getByRole('heading', {name: 'About Me'})).toBeVisible();
	});

	test('experience section is visible', async ({page}) => {
		await expect(page.getByRole('heading', {name: 'Experience'})).toBeVisible();
	});

	test('projects section is visible', async ({page}) => {
		await expect(page.getByRole('heading', {name: 'Featured Projects'})).toBeVisible();
	});

	test('blog section is visible', async ({page}) => {
		const blogHeading = page.getByRole('heading', {name: 'Blog'});
		await expect(blogHeading).toBeVisible();
	});

	test('footer is visible with tagline', async ({page}) => {
		// Scoped to the footer: the About section also starts with "Senior Software Engineer".
		const footer = page.getByRole('contentinfo');
		await footer.scrollIntoViewIfNeeded();
		await expect(footer.getByText('Senior Software Engineer')).toBeVisible();
	});
});
