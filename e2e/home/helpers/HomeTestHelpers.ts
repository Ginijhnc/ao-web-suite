import { FILE_TYPES } from '@Constants/database';
import type { FileType } from '@Constants/database';
import { ROUTES } from '@Constants/routes';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Locator, type Page } from '@playwright/test';
import type { FileChooser } from '@playwright/test';

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

const getUploadReplaceConfirmationDialog = (
	page: Page,
	fileType: FileType,
): Locator => {
	return page.getByRole('dialog', {
		name: `Reemplazar ${fileType.toLowerCase()}`,
	});
};

const confirmUploadReplaceDialog = async (
	page: Page,
	fileType: FileType,
): Promise<void> => {
	const dialog = getUploadReplaceConfirmationDialog(page, fileType);
	await dialog.getByRole('button', { name: 'Reemplazar' }).click();
	await expect(dialog).not.toBeVisible();
};

const triggerUpload = async (
	page: Page,
	files: Parameters<FileChooser['setFiles']>[0],
): Promise<void> => {
	const fileChooser = page.waitForEvent('filechooser');
	await getUploadButton(page).click();
	const chooser = await fileChooser;
	await chooser.setFiles(files);
};

const uploadGraphics = async (
	page: Page,
	files: Array<string>,
	expectedToastText: RegExp | string,
): Promise<void> => {
	await triggerUpload(page, files);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToastText,
	);
};

const getUploadErrorDialog = (page: Page): Locator => {
	return page.getByRole('dialog', { name: 'Error al subir archivos' });
};

const expectUploadErrorDialog = async (
	page: Page,
	expectedText: string,
): Promise<void> => {
	const dialog = getUploadErrorDialog(page);
	await expect(dialog).toBeVisible();
	await expect(dialog).toContainText(expectedText);
	await dialog.getByRole('button', { name: 'Aceptar' }).click();
	await expect(dialog).not.toBeVisible();
};

const uploadGraphicsWithError = async (
	page: Page,
	files: Array<string>,
	expectedText: string,
): Promise<void> => {
	await triggerUpload(page, files);
	await expectUploadErrorDialog(page, expectedText);
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
	getUploadReplaceConfirmationDialog,
	confirmUploadReplaceDialog,
	triggerUpload,
	uploadGraphics,
	getUploadErrorDialog,
	expectUploadErrorDialog,
	uploadGraphicsWithError,
};
