import {test, expect} from '@playwright/test';

test.describe('Not found', () => {
	for (const {locale, title, home} of [
		{locale: 'en', title: '404: Page Not Found', home: 'Return Home'},
		{locale: 'es', title: '404: Página No Encontrada', home: 'Volver al Inicio'},
	]) {
		test(`an unknown path under /${locale} shows the translated 404 inside the site`, async ({page}) => {
			const response = await page.goto(`/${locale}/this-page-does-not-exist`);

			expect(response?.status()).toBe(404);
			await expect(page.getByRole('heading', {level: 1, name: title})).toBeVisible();
			const homeLink = page.getByRole('link', {name: home});
			await expect(homeLink).toBeVisible();
			await expect(homeLink).toHaveAttribute('href', `/${locale}`);
			// Rendered inside the locale layout: the header is there to navigate away.
			await expect(page.getByRole('banner')).toBeVisible();
		});
	}
});
