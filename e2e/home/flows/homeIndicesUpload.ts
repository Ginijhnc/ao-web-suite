import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_NAME, DB_STORE_NAMES, FILE_TYPES } from '@Constants/database';
import {
	CLEAR_SUCCESS,
	GRAPHICS_MESSAGES,
	INDICES_MESSAGES,
} from '@Constants/messages';
import { GENERAL_SELECTORS, HOME_SELECTORS } from '@Constants/selectors';
import {
	armasReplacementStripped,
	armasStripped,
} from '@Fixtures/indices/armas/armas';
import { cabezasStripped } from '@Fixtures/indices/cabezas/cabezas';
import { expect, type Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(dirName, '../../../fixtures/indices');

const uploadIndice = async (
	page: Page,
	diskPath: string,
	presentedName: string,
	expectedToast: string,
): Promise<void> => {
	const fileChooser = page.waitForEvent('filechooser');
	await page.getByTestId(HOME_SELECTORS.UPLOAD_BUTTON).click();
	const chooser = await fileChooser;
	await chooser.setFiles({
		name: presentedName,
		mimeType: 'application/json',
		buffer: fs.readFileSync(diskPath),
	});
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToast,
	);
};

export const uploadValidIndices = async (page: Page): Promise<void> => {
	await uploadIndice(
		page,
		path.join(FIXTURES, 'armas/valid.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(FIXTURES, 'cabezas/valid.json'),
		'cabezas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		['armas.json', 'cabezas.json'],
	);
	await GeneralTestHelpers.assertIdbStoreHasEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		'armas.json',
		expect.objectContaining({
			name: 'armas.json',
			entries: armasStripped,
		}),
	);
	await GeneralTestHelpers.assertIdbStoreHasEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		'cabezas.json',
		expect.objectContaining({
			name: 'cabezas.json',
			entries: cabezasStripped,
		}),
	);
};

export const replaceIndice = async (page: Page): Promise<void> => {
	// Upload initial file and capture its uploadedAt timestamp
	await uploadIndice(
		page,
		path.join(FIXTURES, 'armas/valid.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);

	const firstRecord = (await GeneralTestHelpers.getIdbEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		'armas.json',
	)) as { uploadedAt: number };

	// Replace with a different file and assert entries and timestamp both updated
	await uploadIndice(
		page,
		path.join(FIXTURES, 'armas/armas-valid-replacement.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_REPLACED('armas.json'),
	);

	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		['armas.json'],
	);
	await GeneralTestHelpers.assertIdbStoreHasEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		'armas.json',
		expect.objectContaining({
			name: 'armas.json',
			entries: armasReplacementStripped,
		}),
	);

	// Verify the timestamp was refreshed, not left from the original write
	const secondRecord = (await GeneralTestHelpers.getIdbEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		'armas.json',
	)) as { uploadedAt: number };

	expect(secondRecord.uploadedAt).toBeGreaterThan(
		firstRecord.uploadedAt,
	);
};

export const rejectUnknownIndice = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'unknown/unknown.json');
	await uploadIndice(
		page,
		disk,
		'unknown.json',
		INDICES_MESSAGES.UNKNOWN_INDICE('unknown.json'),
	);
};

export const rejectMalformedJson = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/malformed.json');
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.INVALID_JSON('armas.json'),
	);
};

export const rejectInvalidShape = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/invalid-shape.json');
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.SCHEMA_MISMATCH('armas.json'),
	);
};

export const rejectInvalidEntry = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/invalid-entry.json');
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.SCHEMA_MISMATCH('armas.json'),
	);
};

export const rejectEmptyIndice = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/empty.json');
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.EMPTY_FILE('armas.json'),
	);
};

export const clearIndicesLeavesGraphicsIntact = async (
	page: Page,
): Promise<void> => {
	const graphicsDir = path.resolve(
		dirName,
		'../../../fixtures/graphics/uploads',
	);
	const graphicsFiles = GeneralTestHelpers.getFilePathsFromDirectory(
		graphicsDir,
	).filter((f) => {
		return !f.endsWith('3082.bmp') && !f.endsWith('4006.avif');
	});
	const expectedGraphicsKeys = graphicsFiles.map((f) => {
		return path.basename(f);
	});

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.GRAPHICS);
	await HomeTestHelpers.uploadFiles(
		page,
		HOME_SELECTORS.UPLOAD_BUTTON,
		graphicsFiles,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.INDICES);
	await uploadIndice(
		page,
		path.join(FIXTURES, 'armas/valid.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);

	await page.getByTestId(HOME_SELECTORS.CLEAR_BUTTON).click();
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		CLEAR_SUCCESS(FILE_TYPES.INDICES),
	);
	await GeneralTestHelpers.assertIdbStoreIsEmpty(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
	);
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.GRAPHICS,
		expectedGraphicsKeys,
	);
};

export const clearIndices = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/valid.json');
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);

	await page.getByTestId(HOME_SELECTORS.CLEAR_BUTTON).click();
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		CLEAR_SUCCESS(FILE_TYPES.INDICES),
	);
	await GeneralTestHelpers.assertIdbStoreIsEmpty(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
	);
};
