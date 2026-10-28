import path from 'path';
import { fileURLToPath } from 'url';
import { GRAPHICS_MESSAGES } from '@Constants/messages';
import { HOME_SELECTORS } from '@Constants/selectors';
import type { Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(dirName, '../../../fixtures/graphics');

export const uploadValidGraphics = async (page: Page): Promise<void> => {
	const uploadsDir = path.join(FIXTURES, 'uploads');
	const allFiles =
		GeneralTestHelpers.getFilePathsFromDirectory(uploadsDir);
	// Filter out conflict files (different extensions) used in other test scenarios
	const files = allFiles.filter((f) => {
		return !f.endsWith('3082.bmp') && !f.endsWith('4006.avif');
	});

	await HomeTestHelpers.uploadFiles(
		page,
		HOME_SELECTORS.UPLOAD_BUTTON,
		files,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
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
		HOME_SELECTORS.UPLOAD_BUTTON,
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
		HOME_SELECTORS.UPLOAD_BUTTON,
		allFiles,
		GRAPHICS_MESSAGES.CONFLICT_BATCH('3082.png, 4006.png'),
	);
};

export const clearGraphics = async (page: Page): Promise<void> => {
	const uploadsDir = path.join(FIXTURES, 'uploads');
	const allFiles =
		GeneralTestHelpers.getFilePathsFromDirectory(uploadsDir);
	// Filter out conflict files (different extensions) used in other test scenarios
	const files = allFiles.filter((f) => {
		return !f.endsWith('3082.bmp') && !f.endsWith('4006.avif');
	});

	await HomeTestHelpers.uploadFiles(
		page,
		HOME_SELECTORS.UPLOAD_BUTTON,
		files,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	await page.getByTestId(HOME_SELECTORS.CLEAR_BUTTON).click();
};

export const uploadSameFileForReplacement = async (
	page: Page,
): Promise<void> => {
	const file = [path.join(FIXTURES, 'magic-byte/valid.png')];

	await HomeTestHelpers.uploadFiles(
		page,
		HOME_SELECTORS.UPLOAD_BUTTON,
		file,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await HomeTestHelpers.uploadFiles(
		page,
		HOME_SELECTORS.UPLOAD_BUTTON,
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
		HOME_SELECTORS.UPLOAD_BUTTON,
		pngFile,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await HomeTestHelpers.uploadFiles(
		page,
		HOME_SELECTORS.UPLOAD_BUTTON,
		bmpFile,
		GRAPHICS_MESSAGES.CONFLICT_EXISTING('3082.bmp'),
	);
};
