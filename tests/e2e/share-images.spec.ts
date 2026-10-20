import {test, expect} from '@playwright/test';

// Link previews (LinkedIn, WhatsApp, Slack, X) read og:image; before these routes it pointed at a file that did not exist.
test.describe('Share images', () => {
	for (const path of ['/en', '/es/projects', '/es/projects/docs-assistant']) {
		test(`${path} declares a 1200×630 PNG preview that is served`, async ({page, request}) => {
			await page.goto(path);

			const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
			expect(ogImage).toBeTruthy();
			await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
			await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
			await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /\S/);

			// The absolute URL carries the deployed domain; request the same path on the server under test.
			const {pathname, search} = new URL(ogImage!);
			expect(pathname.startsWith(path)).toBe(true);
			const response = await request.get(pathname + search);
			expect(response.status()).toBe(200);
			expect(response.headers()['content-type']).toBe('image/png');
		});
	}
});
