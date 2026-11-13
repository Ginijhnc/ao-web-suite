import path from 'path';
import { fileURLToPath } from 'url';
import { FILE_TYPES } from '@Constants/database';
import {
	CLEAR_CONFIRM_MESSAGE,
	CLEAR_SUCCESS,
	GRAPHICS_MESSAGES,
} from '@Constants/messages';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(dirName, '../../../fixtures/graphics');
const PUBLIC_GRAPHICS = path.resolve(
	dirName,
	'../../../public/game_assets/graphics',
);

export const uploadPublicGraphics = async (page: Page): Promise<void> => {
	const files =
		GeneralTestHelpers.getFilePathsFromDirectory(PUBLIC_GRAPHICS);
	await HomeTestHelpers.uploadFiles(
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

	await HomeTestHelpers.uploadFiles(
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

	await HomeTestHelpers.uploadFiles(
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

	await HomeTestHelpers.uploadFiles(
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

	await HomeTestHelpers.uploadFiles(
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
		dialog.getByText(CLEAR_CONFIRM_MESSAGE(FILE_TYPES.GRAPHICS)),
	).toBeVisible();
	await HomeTestHelpers.confirmAssetClearDialog(
		page,
		FILE_TYPES.GRAPHICS,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		CLEAR_SUCCESS(FILE_TYPES.GRAPHICS),
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
	await HomeTestHelpers.uploadFiles(
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
		dialog.getByText(CLEAR_CONFIRM_MESSAGE(FILE_TYPES.GRAPHICS)),
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

	await HomeTestHelpers.uploadFiles(
		page,
		file,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await HomeTestHelpers.uploadFiles(
		page,
		file,
		GRAPHICS_MESSAGES.UPLOAD_REPLACED('valid.png'),
	);
};

export const rejectReplacementWithDifferentExtension = async (
	page: Page,
): Promise<void> => {
	const pngFile = [path.join(FIXTURES, 'uploads/3082.png')];
	const bmpFile = [path.join(FIXTURES, 'uploads/3082.bmp')];

	await HomeTestHelpers.uploadFiles(
		page,
		pngFile,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await HomeTestHelpers.uploadFiles(
		page,
		bmpFile,
		GRAPHICS_MESSAGES.CONFLICT_EXISTING('3082.bmp'),
	);
};
