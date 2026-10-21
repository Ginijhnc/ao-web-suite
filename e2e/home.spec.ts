import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display welcome heading', async ({ page }) => {
		const heading = page.getByRole('heading', {
			name: /aoweb suite/i,
		});
		await expect(heading).toBeVisible();
	});
});
