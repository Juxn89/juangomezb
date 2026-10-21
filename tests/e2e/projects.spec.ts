import {test, expect} from '@playwright/test';
import {revealHeaderControls} from '../helpers/header';

const PROJECTS = ['docs-assistant', 'talent-mcp', 'claude-pr-review-bot'];

test.describe('Projects', () => {
	for (const {locale, caseStudy, code} of [
		{locale: 'en', caseStudy: 'Read the case study', code: 'View Code'},
		{locale: 'es', caseStudy: 'Ver el caso de estudio', code: 'Ver Código'},
	]) {
		test(`/${locale}: every featured card links to its case study and its code`, async ({page}) => {
			await page.goto(`/${locale}`);
			const section = page.locator('#projects');
			await section.scrollIntoViewIfNeeded();

			for (const slug of PROJECTS) {
				const card = section.getByRole('article', {name: slug});
				await card.scrollIntoViewIfNeeded();
				await expect(card).toBeVisible();
				await expect(card.getByRole('link', {name: caseStudy})).toHaveAttribute(
					'href',
					`/${locale}/projects/${slug}`
				);
				await expect(card.getByRole('link', {name: code})).toHaveAttribute(
					'href',
					`https://github.com/Juxn89/${slug}`
				);
			}
		});
	}

	test('a card opens its case study in the same tab', async ({page}) => {
		await page.goto('/en');
		const card = page.locator('#projects').getByRole('article', {name: 'talent-mcp'});
		await card.scrollIntoViewIfNeeded();
		await card.getByRole('link', {name: 'Read the case study'}).click();

		await expect(page).toHaveURL(/\/en\/projects\/talent-mcp$/);
		await expect(page.getByRole('heading', {level: 1, name: 'talent-mcp'})).toBeVisible();
		await expect(page.getByRole('heading', {level: 2, name: 'Key decisions'})).toBeVisible();
	});

	test('the index lists every project', async ({page}) => {
		await page.goto('/es/projects');
		await expect(page.getByRole('heading', {level: 1, name: 'Proyectos'})).toBeVisible();
		for (const slug of PROJECTS) {
			const card = page.getByRole('article', {name: slug});
			await card.scrollIntoViewIfNeeded();
			await expect(card).toBeVisible();
		}
	});

	test('the docs-assistant case study plays its demo video from this site', async ({page, request}) => {
		await page.goto('/en/projects/docs-assistant');
		const video = page.locator('#demo video');
		await expect(video).toHaveAttribute('poster', '/projects/docs-assistant/poster.jpg');
		const src = await video.locator('source').getAttribute('src');
		expect(src).toBe('/projects/docs-assistant/demo.mp4');

		const response = await request.head(src!);
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('video/mp4');
	});

	test('the "watch the demo" link lands on the video', async ({page}) => {
		await page.goto('/en');
		const card = page.locator('#projects').getByRole('article', {name: 'docs-assistant'});
		await card.scrollIntoViewIfNeeded();
		await card.getByRole('link', {name: 'Watch the demo'}).click();

		await expect(page).toHaveURL(/\/en\/projects\/docs-assistant#demo$/);
		await expect(page.locator('#demo')).toBeInViewport();
	});

	test('the claude-pr-review-bot case study shows real screenshots and links the live demo', async ({page, request}) => {
		await page.goto('/es/projects/claude-pr-review-bot');
		await expect(page.getByRole('link', {name: 'Ver Demo'})).toHaveAttribute(
			'href',
			'https://github.com/Juxn89/pr-review-bot-demo/pull/1'
		);

		const images = page.locator('#gallery img');
		await expect(images).toHaveCount(4);
		for (const link of await page.locator('#gallery a').all()) {
			const response = await request.get((await link.getAttribute('href'))!);
			expect(response.status()).toBe(200);
			expect(response.headers()['content-type']).toBe('image/webp');
		}
	});

	test('the talent-mcp case study shows its three screenshots', async ({page, request}) => {
		await page.goto('/en/projects/talent-mcp');
		await expect(page.locator('#gallery img')).toHaveCount(3);
		const first = await page.locator('#gallery a').first().getAttribute('href');
		expect((await request.get(first!)).status()).toBe(200);
	});

	test('an unknown slug is a 404', async ({page}) => {
		const response = await page.goto('/en/projects/does-not-exist');
		expect(response?.status()).toBe(404);
	});

	test('the locale switcher keeps the case study', async ({page, isMobile}) => {
		await page.goto('/en/projects/claude-pr-review-bot');
		await revealHeaderControls(page, isMobile);
		await page.getByRole('link', {name: /spanish|español/i}).filter({visible: true}).click();

		await expect(page).toHaveURL(/\/es\/projects\/claude-pr-review-bot$/);
		await expect(page.getByRole('heading', {level: 2, name: 'Decisiones clave'})).toBeVisible();
	});

	test('header links work from a case study', async ({page, isMobile}) => {
		await page.goto('/en/projects/docs-assistant');
		await revealHeaderControls(page, isMobile);

		// By href: the breadcrumb also has a "Projects" link, to the index rather than the home section.
		const projectsLink = page.locator('a[href="/en#projects"]').filter({visible: true});
		await expect(projectsLink).toHaveAttribute('aria-current', 'location');

		await page.getByRole('link', {name: 'Experience', exact: true}).filter({visible: true}).click();
		await expect(page).toHaveURL(/\/en#experience$/);
		await expect(page.locator('#experience')).toBeInViewport();
	});
});
