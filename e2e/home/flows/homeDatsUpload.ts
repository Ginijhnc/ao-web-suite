import fs from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { DB_NAME, DB_STORE_NAMES, FILE_TYPES } from '@Constants/database';
import { DATS_MESSAGES, RESOURCES_MESSAGES } from '@Constants/messages';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import * as beefyHechizos from '@Fixtures/dats/hechizos/beefy/beefyHechizosExpected';
import * as beefyNpcs from '@Fixtures/dats/npcs/beefy/beefyNpcsExpected';
import * as beefyObj from '@Fixtures/dats/obj/beefy/beefyObjExpected';
import { expect, type Page } from '@playwright/test';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(process.cwd(), 'fixtures', 'dats');
const PUBLIC_DATS = path.resolve(
	dirName,
	'../../../public/game_assets/dats',
);

const uploadDat = async (
	page: Page,
	diskPath: string,
	presentedName: string,
	expectedToast: string,
): Promise<void> => {
	await HomeTestHelpers.triggerUpload(page, {
		name: presentedName,
		mimeType: 'application/octet-stream',
		buffer: fs.readFileSync(diskPath),
	});
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToast,
	);
};

const uploadDatWithError = async (
	page: Page,
	diskPath: string,
	presentedName: string,
	expectedText: string,
): Promise<void> => {
	await HomeTestHelpers.triggerUpload(page, {
		name: presentedName,
		mimeType: 'application/octet-stream',
		buffer: fs.readFileSync(diskPath),
	});
	await HomeTestHelpers.expectUploadErrorDialog(page, expectedText);
};

export const uploadValidNpcs = async (page: Page): Promise<void> => {
	await expect(HomeTestHelpers.getClearButton(page)).toBeDisabled();
	await expect(page.getByText('npcs.dat')).toBeVisible();
	await expect(
		page.getByText('npcs.dat').locator('..').getByLabel('faltante'),
	).toBeVisible();

	await uploadDat(
		page,
		path.join(FIXTURES, 'npcs/beefy/NPCs.dat'),
		'NPCs.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(HomeTestHelpers.getClearButton(page)).toBeEnabled();
	await expect(
		page.getByText('npcs.dat').locator('..').getByLabel('subido'),
	).toBeVisible();
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.DATS,
		['npcs.dat'],
	);
	await GeneralTestHelpers.assertIdbStoreHasEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.DATS,
		'npcs.dat',
		expect.objectContaining({
			name: 'npcs.dat',
			data: {
				numNpcs: beefyNpcs.numNpcs,
				npcCategories: beefyNpcs.npcCategories,
				entries: beefyNpcs.entries,
			},
		}),
	);
};

export const uploadValidHechizos = async (page: Page): Promise<void> => {
	await uploadDat(
		page,
		path.join(FIXTURES, 'hechizos/beefy/Hechizos.dat'),
		'Hechizos.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.DATS,
		['hechizos.dat'],
	);
	await GeneralTestHelpers.assertIdbStoreHasEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.DATS,
		'hechizos.dat',
		expect.objectContaining({
			name: 'hechizos.dat',
			data: {
				numeroHechizos: beefyHechizos.numeroHechizos,
				hechizoTypes: beefyHechizos.hechizoTypes,
				hechizoTargets: beefyHechizos.hechizoTargets,
				entries: beefyHechizos.entries,
			},
		}),
	);
};

export const replaceDatRequiresConfirmation = async (
	page: Page,
): Promise<void> => {
	await uploadDat(
		page,
		path.join(FIXTURES, 'hechizos/beefy/Hechizos.dat'),
		'Hechizos.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);

	/* Second upload of the same file: should open the dialog, not
	   replace directly. */
	await HomeTestHelpers.triggerUpload(page, {
		name: 'Hechizos.dat',
		mimeType: 'application/octet-stream',
		buffer: fs.readFileSync(
			path.join(FIXTURES, 'hechizos/beefy/Hechizos.dat'),
		),
	});

	const confirmationDialog =
		HomeTestHelpers.getUploadReplaceConfirmationDialog(
			page,
			FILE_TYPES.DATS,
		);
	await expect(confirmationDialog).toBeVisible();
	await expect(confirmationDialog).toContainText(
		RESOURCES_MESSAGES.UPLOAD_REPLACE_CONFIRM('hechizos.dat', 1),
	);

	await HomeTestHelpers.confirmUploadReplaceDialog(
		page,
		FILE_TYPES.DATS,
	);
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		DATS_MESSAGES.UPLOAD_REPLACED('hechizos.dat'),
	);
};

export const rejectDuplicateIds = async (page: Page): Promise<void> => {
	await uploadDatWithError(
		page,
		path.join(FIXTURES, 'npcs/duplicate-ids/NPCs.dat'),
		'NPCs.dat',
		DATS_MESSAGES.DUPLICATE_IDS('NPCs.dat'),
	);
};

export const rejectDuplicateFields = async (page: Page): Promise<void> => {
	await uploadDatWithError(
		page,
		path.join(FIXTURES, 'hechizos/duplicate-fields/Hechizos.dat'),
		'Hechizos.dat',
		DATS_MESSAGES.DUPLICATE_FIELDS('Hechizos.dat'),
	);
};

export const uploadPublicDats = async (page: Page): Promise<void> => {
	await uploadDat(
		page,
		path.join(PUBLIC_DATS, 'NPCs.dat'),
		'NPCs.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadDat(
		page,
		path.join(PUBLIC_DATS, 'Hechizos.dat'),
		'Hechizos.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
	await uploadDat(
		page,
		path.join(PUBLIC_DATS, 'Obj.dat'),
		'Obj.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
};

export const uploadValidObj = async (page: Page): Promise<void> => {
	await uploadDat(
		page,
		path.join(FIXTURES, 'obj/beefy/obj.dat'),
		'obj.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
	await GeneralTestHelpers.assertIdbStoreHasKeys(
		page,
		DB_NAME,
		DB_STORE_NAMES.DATS,
		['obj.dat'],
	);
	await GeneralTestHelpers.assertIdbStoreHasEntry(
		page,
		DB_NAME,
		DB_STORE_NAMES.DATS,
		'obj.dat',
		expect.objectContaining({
			name: 'obj.dat',
			data: {
				numObjs: beefyObj.numObjs,
				objCategories: beefyObj.objCategories,
				potionCategories: beefyObj.potionCategories,
				entries: beefyObj.entries,
			},
		}),
	);
};
