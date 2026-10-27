import { ROUTES } from '@Constants/routes';
import { type Page } from '@playwright/test';

const navigateToHomePage = async (page: Page): Promise<void> => {
	await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
};

const waitForHomePageElements = async (page: Page): Promise<void> => {
	await page
		.getByRole('button', { name: 'Gráficos' })
		.waitFor({ state: 'visible' });
	await page
		.getByRole('button', { name: 'Subir' })
		.waitFor({ state: 'visible' });
	await page
		.getByRole('button', { name: 'Borrar' })
		.waitFor({ state: 'visible' });
};

export const HomeTestHelpers = {
	navigateToHomePage,
	waitForHomePageElements,
};
