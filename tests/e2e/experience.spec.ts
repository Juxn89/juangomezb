import {test, expect} from '@playwright/test';

test.describe('Experience', () => {
	test('collapsed achievements are still in the server HTML, so search engines index them', async ({request}) => {
		const html = await (await request.get('/es')).text();
		// Not shown until expanded: one from the current role, one from the oldest.
		expect(html).toContain('Aseguré alta disponibilidad y rendimiento de los servicios en AWS');
		expect(html).toContain('Migré el Sistema de Formulación de Proyectos de escritorio a web');
	});

	test('a role shows its strongest achievements and expands to the rest', async ({page}) => {
		await page.goto('/en');
		// By heading: both Stepstone roles name the company.
		const role = page
			.locator('#experience article')
			.filter({has: page.getByRole('heading', {name: 'Senior Software Engineer', exact: true})});
		await role.scrollIntoViewIfNeeded();

		await expect(role.getByText('Co-built, in a team of two, an AI assistant')).toBeVisible();
		await expect(role.getByText('Cut deployment times by ~25%')).toBeVisible();
		const hidden = role.getByText('Ensured high availability and performance of services on AWS');
		await expect(hidden).toBeHidden();

		const toggle = role.getByRole('button', {name: 'Show 5 more achievements'});
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		// A click before hydration does nothing; retry until the list opens.
		await expect(async () => {
			await toggle.click();
			await expect(hidden).toBeVisible({timeout: 1_000});
		}).toPass({timeout: 20_000});

		await expect(role.getByRole('button', {name: 'Show less'})).toHaveAttribute('aria-expanded', 'true');
	});

	test('older roles show only their summary until expanded', async ({page}) => {
		await page.goto('/es');
		// By heading: the other INIFOM role and the Procuraduría role also mention INIFOM.
		const role = page.locator('#experience article').filter({has: page.getByRole('heading', {name: 'Líder de Equipo'})});
		await role.scrollIntoViewIfNeeded();

		await expect(role.getByText('equipo de 5 desarrolladores')).toBeVisible();
		await expect(role.getByText('Migré aplicaciones legacy de ASP.NET a .NET Core')).toBeHidden();
		await expect(role.getByRole('button', {name: 'Ver logros (3)'})).toBeVisible();
	});
});
