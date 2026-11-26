import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { DB_NAME, DB_STORE_NAMES, FILE_TYPES } from '@Constants/database';
import {
	GRAPHICS_MESSAGES,
	RESOURCES_MESSAGES,
} from '@Constants/messages';
import { ROUTES_TITLES } from '@Constants/routes';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { SidebarTestHelpers } from '../../shared/helpers/SidebarTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(process.cwd(), 'fixtures', 'graphics');
const PUBLIC_GRAPHICS = path.resolve(
	dirName,
	'../../../public/game_assets/graphics',
);

export const uploadPublicGraphics = async (page: Page): Promise<void> => {
	const files =
		GeneralTestHelpers.getFilePathsFromDirectory(PUBLIC_GRAPHICS);
	await HomeTestHelpers.uploadGraphics(
		page,
		files,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(
		page.getByText(`${files.length} imágenes subidas.`),
	).toBeVisible();
};

export const uploadValidGraphics = async (page: Page): Promise<void> => {
	const uploadsDir = path.join(FIXTURES, 'uploads');
	const allFiles =
		GeneralTestHelpers.getFilePathsFromDirectory(uploadsDir);
	// Filter out conflict files (different extensions) used in other test scenarios
	const files = allFiles.filter((f) => {
		return !f.endsWith('3082.bmp') && !f.endsWith('4006.avif');
	});

	await expect(
		page.getByText('Falta subir los gráficos.'),
	).toBeVisible();

	await HomeTestHelpers.uploadGraphics(
		page,
		files,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	await expect(page.getByText(/\d+ imágenes subidas\./)).toBeVisible();
};

export const uploadBatchWithConflict = async (
	page: Page,
): Promise<void> => {
	const files = [
		path.join(FIXTURES, 'uploads/3082.png'),
		path.join(FIXTURES, 'uploads/3082.bmp'),
	].sort((a, b) => {
		return path.basename(a).localeCompare(path.basename(b));
	});

	await HomeTestHelpers.uploadGraphicsWithError(
		page,
		files,
		GRAPHICS_MESSAGES.CONFLICT_BATCH('3082.png'),
	);
};

export const uploadBatchWithMultipleConflicts = async (
	page: Page,
): Promise<void> => {
	const uploadsDir = path.join(FIXTURES, 'uploads');
	const files = GeneralTestHelpers.getFilePathsFromDirectory(uploadsDir);
	const conflictFiles = files.filter((f) => {
		return f.endsWith('3082.bmp') || f.endsWith('4006.avif');
	});
	const allFiles = [...files, ...conflictFiles].sort((a, b) => {
		return path.basename(a).localeCompare(path.basename(b));
	});

	await HomeTestHelpers.uploadGraphicsWithError(
		page,
		allFiles,
		GRAPHICS_MESSAGES.CONFLICT_BATCH('3082.png, 4006.png'),
	);
};

export const clearGraphics = async (page: Page): Promise<void> => {
	const clearButton = HomeTestHelpers.getClearButton(page);
	await expect(clearButton).toBeDisabled();

	const uploadsDir = path.join(FIXTURES, 'uploads');
	const allFiles =
		GeneralTestHelpers.getFilePathsFromDirectory(uploadsDir);
	// Filter out conflict files (different extensions) used in other test scenarios
	const files = allFiles.filter((f) => {
		return !f.endsWith('3082.bmp') && !f.endsWith('4006.avif');
	});

	await HomeTestHelpers.uploadGraphics(
		page,
		files,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(clearButton).toBeEnabled();

	await clearButton.click();
	const dialog = HomeTestHelpers.getClearAssetConfirmationDialog(
		page,
		FILE_TYPES.GRAPHICS,
	);
	await expect(dialog).toBeVisible();
	await expect(
		dialog.getByText(
			RESOURCES_MESSAGES.CLEAR_CONFIRM(FILE_TYPES.GRAPHICS),
		),
	).toBeVisible();
	await HomeTestHelpers.confirmAssetClearDialog(
		page,
		FILE_TYPES.GRAPHICS,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		RESOURCES_MESSAGES.CLEAR_SUCCESS(FILE_TYPES.GRAPHICS),
	);
	await expect(clearButton).toBeDisabled();
	await expect(
		page.getByText('Falta subir los gráficos.'),
	).toBeVisible();
};

export const dismissClearGraphicsDialog = async (
	page: Page,
): Promise<void> => {
	const file = [path.join(FIXTURES, 'uploads/3082.png')];
	await HomeTestHelpers.uploadGraphics(
		page,
		file,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	const clearButton = HomeTestHelpers.getClearButton(page);
	await clearButton.click();
	const dialog = HomeTestHelpers.getClearAssetConfirmationDialog(
		page,
		FILE_TYPES.GRAPHICS,
	);
	await expect(dialog).toBeVisible();
	await expect(
		dialog.getByText(
			RESOURCES_MESSAGES.CLEAR_CONFIRM(FILE_TYPES.GRAPHICS),
		),
	).toBeVisible();
	await HomeTestHelpers.cancelAssetClearDialog(
		page,
		FILE_TYPES.GRAPHICS,
	);
	await expect(clearButton).toBeEnabled();
	await expect(page.getByText('1 imagen subida.')).toBeVisible();
};

export const uploadSameFileForReplacement = async (
	page: Page,
): Promise<void> => {
	const file = [path.join(FIXTURES, 'magic-byte/valid.png')];

	await HomeTestHelpers.uploadGraphics(
		page,
		file,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	await HomeTestHelpers.triggerUpload(page, file);
	const confirmationDialog =
		HomeTestHelpers.getUploadReplaceConfirmationDialog(
			page,
			FILE_TYPES.GRAPHICS,
		);
	await expect(confirmationDialog).toBeVisible();
	await expect(confirmationDialog).toContainText(
		RESOURCES_MESSAGES.UPLOAD_REPLACE_CONFIRM('valid.png', 1),
	);

	await HomeTestHelpers.confirmUploadReplaceDialog(
		page,
		FILE_TYPES.GRAPHICS,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		GRAPHICS_MESSAGES.UPLOAD_REPLACED('valid.png'),
	);
	await expect(page.getByText('1 imagen subida.')).toBeVisible();
};

export const rejectReplacementWithDifferentExtension = async (
	page: Page,
): Promise<void> => {
	const pngFile = [path.join(FIXTURES, 'uploads/3082.png')];
	const bmpFile = [path.join(FIXTURES, 'uploads/3082.bmp')];

	await HomeTestHelpers.uploadGraphics(
		page,
		pngFile,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await HomeTestHelpers.uploadGraphicsWithError(
		page,
		bmpFile,
		GRAPHICS_MESSAGES.CONFLICT_EXISTING('3082.bmp'),
	);
};

export const showsSpinnerAndDisablesActionsDuringUpload = async (
	page: Page,
): Promise<void> => {
	const files =
		GeneralTestHelpers.getFilePathsFromDirectory(PUBLIC_GRAPHICS);

	const uploadButton = HomeTestHelpers.getUploadButton(page);
	const clearButton = HomeTestHelpers.getClearButton(page);

	const fileChooserPromise = page.waitForEvent('filechooser');
	await uploadButton.click();
	const chooser = await fileChooserPromise;
	await chooser.setFiles(files);

	await expect(uploadButton).toHaveText('Subiendo...');
	await expect(uploadButton.getByRole('progressbar')).toBeVisible();
	await expect(uploadButton).toBeDisabled();
	await expect(clearButton).toBeDisabled();

	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(uploadButton).toHaveText('Subir');
	await expect(uploadButton.getByRole('progressbar')).toBeHidden();
	await expect(uploadButton).toBeEnabled();
	await expect(clearButton).toBeEnabled();
};

export const uploadContinuesInBackgroundAfterNavigatingAway = async (
	page: Page,
): Promise<void> => {
	const files =
		GeneralTestHelpers.getFilePathsFromDirectory(PUBLIC_GRAPHICS);
	const uploadButton = HomeTestHelpers.getUploadButton(page);

	const fileChooserPromise = page.waitForEvent('filechooser');
	await uploadButton.click();
	const chooser = await fileChooserPromise;
	await chooser.setFiles(files);

	/* Confirms the upload is still in flight before navigating away,
	   so the assertions below actually prove the write survives the
	   unmount instead of coincidentally running after it already
	   finished. */
	await expect(uploadButton).toBeDisabled();

	await SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.CONFIGURACION,
	).click();

	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	const expectedKeys = files.map((filePath) => {
		return path.basename(filePath);
	});
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.GRAPHICS,
		expectedKeys,
	);
};
