import {expect, type Page} from '@playwright/test';

/**
 * Below the md breakpoint the header's navigation links, theme toggle and locale switcher live in
 * the mobile menu, so a test that uses them opens it first.
 */
export async function revealHeaderControls(page: Page, isMobile: boolean): Promise<void> {
	if (!isMobile) return;

	// A click that lands before hydration does nothing, and the dev server compiles the lazily loaded
	// menu on first use, so retry until it is open. Click only while it is still closed: once open, its
	// backdrop covers the button and a second click would wait for it forever.
	const closeButton = page.getByRole('button', {name: 'Close menu'});
	await expect(async () => {
		if (!(await closeButton.isVisible())) {
			await page.getByRole('button', {name: 'Open menu'}).click({timeout: 2_000});
		}
		await expect(closeButton).toBeVisible({timeout: 2_000});
	}).toPass({timeout: 40_000});
}
