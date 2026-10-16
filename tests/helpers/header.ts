import type {Page} from '@playwright/test';

/**
 * Below the md breakpoint the header's navigation links, theme toggle and locale switcher live in
 * the mobile menu, so a test that uses them opens it first.
 */
export async function revealHeaderControls(page: Page, isMobile: boolean): Promise<void> {
	if (isMobile) {
		await page.getByRole('button', {name: 'Open menu'}).click();
	}
}
