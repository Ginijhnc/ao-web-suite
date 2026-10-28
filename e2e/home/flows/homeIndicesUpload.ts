import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_NAME, DB_STORE_NAMES, FILE_TYPES } from '@Constants/database';
import { CLEAR_SUCCESS, INDICES_MESSAGES } from '@Constants/messages';
import { GENERAL_SELECTORS, HOME_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(dirName, '../../../tests/fixtures/indices');

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
};

export const replaceIndice = async (page: Page): Promise<void> => {
	const disk = path.join(FIXTURES, 'armas/valid.json');

	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadIndice(
		page,
		disk,
		'armas.json',
		INDICES_MESSAGES.UPLOAD_REPLACED('armas.json'),
	);
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.INDICES,
		['armas.json'],
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
