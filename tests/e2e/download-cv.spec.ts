import {test, expect} from '@playwright/test';

test.describe('CV download', () => {
	for (const locale of ['en', 'es']) {
		test(`serves the ${locale} CV as a PDF attachment`, async ({request}) => {
			const response = await request.get(`/api/download-cv?locale=${locale}`);

			expect(response.status()).toBe(200);
			expect(response.headers()['content-type']).toBe('application/pdf');
			expect(response.headers()['content-disposition']).toBe(`attachment; filename="juan-gomez-cv-${locale}.pdf"`);
			expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
		});
	}

	test('rejects an unknown locale', async ({request}) => {
		const response = await request.get('/api/download-cv?locale=fr');
		expect(response.status()).toBe(400);
	});
});
