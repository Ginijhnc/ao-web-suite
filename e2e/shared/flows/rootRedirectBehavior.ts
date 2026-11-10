import { FILE_TYPES } from '@Constants/database';
import { ROUTES } from '@Constants/routes';
import { expect, type Page } from '@playwright/test';
import { uploadPublicGraphics } from '../../home/flows/homeAssetsUpload';
import { uploadPublicDats } from '../../home/flows/homeDatsUpload';
import { uploadPublicIndices } from '../../home/flows/homeIndicesUpload';
import { HomeTestHelpers } from '../../home/helpers/HomeTestHelpers';
import { OverviewTestHelpers } from '../../overview/helpers/OverviewTestHelpers';

export const redirectsToRecursosWithNoAssets = async (
	page: Page,
): Promise<void> => {
	await page.goto('/');
	await page.waitForURL(ROUTES.RECURSOS);
	await expect(page).toHaveURL(ROUTES.RECURSOS);
	await HomeTestHelpers.waitForHomePageElements(page);
};

export const redirectsToPanelWithAssetsLoaded = async (
	page: Page,
): Promise<void> => {
	await uploadPublicGraphics(page);
	await HomeTestHelpers.selectFileType(page, FILE_TYPES.DATS);
	await uploadPublicDats(page);
	await HomeTestHelpers.selectFileType(page, FILE_TYPES.INDICES);
	await uploadPublicIndices(page);

	const siguienteButton = page.getByRole('button', {
		name: 'Siguiente',
	});
	await expect(siguienteButton).toBeEnabled();

	await page.goto('/');
	await page.waitForURL(ROUTES.OVERVIEW);
	await expect(page).toHaveURL(ROUTES.OVERVIEW);
	await OverviewTestHelpers.waitForOverviewElements(page);
};
