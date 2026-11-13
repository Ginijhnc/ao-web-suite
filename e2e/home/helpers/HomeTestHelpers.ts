import { FILE_TYPES } from '@Constants/database';
import type { FileType } from '@Constants/database';
import { ROUTES } from '@Constants/routes';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Locator, type Page } from '@playwright/test';

const navigateToHomePage = async (page: Page): Promise<void> => {
	await page.goto(ROUTES.RECURSOS, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
};

const waitForHomePageElements = async (page: Page): Promise<void> => {
	await page
		.getByRole('button', { name: FILE_TYPES.GRAPHICS })
		.waitFor({ state: 'visible' });
	await page
		.getByRole('button', { name: FILE_TYPES.INDICES })
		.waitFor({ state: 'visible' });
	await page
		.getByRole('button', { name: 'Subir' })
		.waitFor({ state: 'visible' });
	await page
		.getByRole('button', { name: 'Borrar' })
		.waitFor({ state: 'visible' });
};

/**
 * Clicks the chip in HomeUploaders that switches the active file type
 * (Gráficos, Índices, Dats).
 */
const selectFileType = async (
	page: Page,
	fileType: FileType,
): Promise<void> => {
	await page.getByRole('button', { name: fileType }).click();
};

const getUploadButton = (page: Page): Locator => {
	return page.getByRole('button', { name: 'Subir' });
};

const getClearButton = (page: Page): Locator => {
	return page.getByRole('button', { name: 'Borrar' });
};

const getClearAssetConfirmationDialog = (
	page: Page,
	fileType: FileType,
): Locator => {
	return page.getByRole('dialog', {
		name: `Borrar ${fileType.toLowerCase()}`,
	});
};

const confirmAssetClearDialog = async (
	page: Page,
	fileType: FileType,
): Promise<void> => {
	const dialog = getClearAssetConfirmationDialog(page, fileType);
	await dialog.getByRole('button', { name: 'Borrar' }).click();
	await expect(dialog).not.toBeVisible();
};

const cancelAssetClearDialog = async (
	page: Page,
	fileType: FileType,
): Promise<void> => {
	const dialog = getClearAssetConfirmationDialog(page, fileType);
	await dialog.getByRole('button', { name: 'Cancelar' }).click();
	await expect(dialog).not.toBeVisible();
};

const uploadFiles = async (
	page: Page,
	files: Array<string>,
	expectedToastText: RegExp | string,
): Promise<void> => {
	const fileChooser = page.waitForEvent('filechooser');
	await getUploadButton(page).click();
	const chooser = await fileChooser;
	await chooser.setFiles(files);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToastText,
	);
};

export const HomeTestHelpers = {
	navigateToHomePage,
	waitForHomePageElements,
	selectFileType,
	getUploadButton,
	getClearButton,
	getClearAssetConfirmationDialog,
	confirmAssetClearDialog,
	cancelAssetClearDialog,
	uploadFiles,
};
