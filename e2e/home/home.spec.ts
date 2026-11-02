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

	/* TO DO - Pendiente: agregar test para verificar que el botón de ir al 
	   dashboard se habilite después de subir todos los assets */
	test('should display the dashboard button as disabled on initial load', async ({
		page,
	}) => {
		const button = page.getByRole('button', {
			name: /siguiente/i,
		});
		await expect(button).toBeVisible();
		await expect(button).toBeDisabled();
	});
});
