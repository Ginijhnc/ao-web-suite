import { ROUTES, ROUTES_TITLES } from '@Constants/routes';
import { expect, type Page } from '@playwright/test';
import { SidebarTestHelpers } from '../helpers/SidebarTestHelpers';

export const assertPageChunkFailureShowsFallback = async (
	page: Page,
): Promise<void> => {
	await page.goto(ROUTES.RECURSOS, { waitUntil: 'domcontentloaded' });

	await page.route(/LogsPage/, (route) => {
		return route.abort();
	});

	const logsNavLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.LOGS,
	);
	await logsNavLink.click();

	await expect(
		page.getByText('No se pudo cargar la página'),
	).toBeVisible();
	await expect(
		page.getByRole('button', { name: 'Recargar' }),
	).toBeVisible();
	// await page.waitForTimeout(5000);
};
