import { FILE_TYPES } from '@Constants/database';
import { expect, type Page } from '@playwright/test';
import { uploadPublicGraphics } from '../../home/flows/homeAssetsUpload';
import { uploadPublicDats } from '../../home/flows/homeDatsUpload';
import { uploadPublicIndices } from '../../home/flows/homeIndicesUpload';
import { HomeTestHelpers } from '../../home/helpers/HomeTestHelpers';
import { OverviewTestHelpers } from '../helpers/OverviewTestHelpers';

export const uploadAllAssetsAndNavigate = async (
	page: Page,
): Promise<void> => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);

	const siguienteButton = page.getByRole('button', {
		name: 'Siguiente',
	});
	await expect(siguienteButton).toBeDisabled();

	await uploadPublicGraphics(page);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.DATS);
	await uploadPublicDats(page);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.INDICES);
	await uploadPublicIndices(page);

	await expect(siguienteButton).toBeEnabled();
	await siguienteButton.click();
	await OverviewTestHelpers.waitForOverviewElements(page);
};
