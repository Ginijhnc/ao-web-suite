import { FILE_TYPES } from '@Constants/database';
import type { FileType } from '@Constants/database';
import { ROUTES } from '@Constants/routes';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';

const navigateToHomePage = async (page: Page): Promise<void> => {
	await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });
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

const uploadFiles = async (
	page: Page,
	uploadButtonTestId: string,
	files: Array<string>,
	expectedToastText: RegExp | string,
): Promise<void> => {
	const fileChooser = page.waitForEvent('filechooser');
	await page.getByTestId(uploadButtonTestId).click();
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
	uploadFiles,
};
