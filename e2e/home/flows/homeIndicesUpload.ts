import fs from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { DB_NAME, DB_STORE_NAMES, FILE_TYPES } from '@Constants/database';
import {
	GRAPHICS_MESSAGES,
	INDICES_MESSAGES,
	RESOURCES_MESSAGES,
} from '@Constants/messages';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import {
	armasReplacementStripped,
	armasStripped,
} from '@Fixtures/indices/armas/valid/armas';
import { cabezasStripped } from '@Fixtures/indices/cabezas/valid/cabezas';
import { expect, type Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(process.cwd(), 'fixtures', 'indices');
const PUBLIC_INDICES = path.resolve(
	dirName,
	'../../../public/game_assets/indices',
);

const uploadIndice = async (
	page: Page,
	diskPath: string,
	presentedName: string,
	expectedToast: string,
): Promise<void> => {
	await HomeTestHelpers.triggerUpload(page, {
		name: presentedName,
		mimeType: 'application/json',
		buffer: fs.readFileSync(diskPath),
	});
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToast,
	);
};

const uploadIndiceWithError = async (
	page: Page,
	diskPath: string,
	presentedName: string,
	expectedText: string,
): Promise<void> => {
	await HomeTestHelpers.triggerUpload(page, {
		name: presentedName,
		mimeType: 'application/json',
		buffer: fs.readFileSync(diskPath),
	});
	await HomeTestHelpers.expectUploadErrorDialog(page, expectedText);
};

// Only uploads 2 of the 7 recognized índice names.
export const uploadValidIndices = async (page: Page): Promise<void> => {
	await expect(page.getByText('armas.json')).toBeVisible();
	await expect(page.getByLabel('faltante').first()).toBeVisible();

	await uploadIndice(
		page,
		path.join(FIXTURES, 'armas/valid/armas.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(
		page.getByText('armas.json').locator('..').getByLabel('subido'),
	).toBeVisible();

	await uploadIndice(
		page,
		path.join(FIXTURES, 'cabezas/valid/cabezas.json'),
		'cabezas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(
		page.getByText('cabezas.json').locator('..').getByLabel('subido'),
	).toBeVisible();
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
		path.join(FIXTURES, 'armas/valid/armas.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);

	const firstRecord = (await GeneralTestHelpers.getIdbEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		'armas.json',
	)) as { uploadedAt: number };

	await HomeTestHelpers.triggerUpload(page, {
		name: 'armas.json',
		mimeType: 'application/json',
		buffer: fs.readFileSync(
			path.join(FIXTURES, 'armas/replacement/armas.json'),
		),
	});
	const confirmationDialog =
		HomeTestHelpers.getUploadReplaceConfirmationDialog(
			page,
			FILE_TYPES.INDICES,
		);
	await expect(confirmationDialog).toBeVisible();
	await expect(confirmationDialog).toContainText(
		RESOURCES_MESSAGES.UPLOAD_REPLACE_CONFIRM('armas.json', 1),
	);
	await HomeTestHelpers.confirmUploadReplaceDialog(
		page,
		FILE_TYPES.INDICES,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
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
	await uploadIndiceWithError(
		page,
		disk,
		'unknown.json',
		INDICES_MESSAGES.UNKNOWN_INDICE('unknown.json'),
	);
};

export const rejectMalformedJson = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/malformed/armas.json');
	await uploadIndiceWithError(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.INVALID_JSON('armas.json'),
	);
};

export const rejectInvalidShape = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/invalid-shape/armas.json');
	await uploadIndiceWithError(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.SCHEMA_MISMATCH('armas.json'),
	);
};

export const rejectInvalidEntry = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/invalid-entry/armas.json');
	await uploadIndiceWithError(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.SCHEMA_MISMATCH('armas.json'),
	);
};

export const rejectEmptyIndice = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/empty/armas.json');
	await uploadIndiceWithError(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.EMPTY_FILE('armas.json'),
	);
};

export const clearIndicesLeavesGraphicsIntact = async (
	page: Page,
): Promise<void> => {
	const graphicsDir = join(
		process.cwd(),
		'fixtures',
		'graphics',
		'uploads',
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
	await HomeTestHelpers.uploadGraphics(
		page,
		graphicsFiles,
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.INDICES);
	await uploadIndice(
		page,
		path.join(FIXTURES, 'armas/valid/armas.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);

	await HomeTestHelpers.getClearButton(page).click();
	await HomeTestHelpers.confirmAssetClearDialog(
		page,
		FILE_TYPES.INDICES,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		RESOURCES_MESSAGES.CLEAR_SUCCESS(FILE_TYPES.INDICES),
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

export const uploadPublicIndices = async (page: Page): Promise<void> => {
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'armas.json'),
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'cabezas.json'),
		'cabezas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'cascos.json'),
		'cascos.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'cuerpos.json'),
		'cuerpos.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'escudos.json'),
		'escudos.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'fxs.json'),
		'fxs.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		path.join(PUBLIC_INDICES, 'graficos.json'),
		'graficos.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
};

export const clearIndices = async (page: Page): Promise<void> => {
	const clearButton = HomeTestHelpers.getClearButton(page);
	await expect(clearButton).toBeDisabled();

	const disk = path.join(FIXTURES, 'armas/valid/armas.json');
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(clearButton).toBeEnabled();

	await clearButton.click();
	const dialog = HomeTestHelpers.getClearAssetConfirmationDialog(
		page,
		FILE_TYPES.INDICES,
	);
	await expect(dialog).toBeVisible();
	await expect(
		dialog.getByText(
			RESOURCES_MESSAGES.CLEAR_CONFIRM(FILE_TYPES.INDICES),
		),
	).toBeVisible();
	await HomeTestHelpers.confirmAssetClearDialog(
		page,
		FILE_TYPES.INDICES,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		RESOURCES_MESSAGES.CLEAR_SUCCESS(FILE_TYPES.INDICES),
	);
	await GeneralTestHelpers.assertIdbStoreIsEmpty(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
	);
	await expect(clearButton).toBeDisabled();
	await expect(
		page.getByText('armas.json').locator('..').getByLabel('faltante'),
	).toBeVisible();
};
