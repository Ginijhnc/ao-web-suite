import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_NAME, DB_STORE_NAMES } from '@Constants/database';
import { DATS_MESSAGES } from '@Constants/messages';
import { GENERAL_SELECTORS, HOME_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import * as beefyHechizos from '../../../fixtures/dats/hechizos/beefyHechizosExpected';
import * as beefyNpcs from '../../../fixtures/dats/npcs/beefyNpcsExpected';
import * as beefyObj from '../../../fixtures/dats/obj/beefyObjExpected';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(dirName, '../../../fixtures/dats');

const uploadDat = async (
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
		mimeType: 'application/octet-stream',
		buffer: fs.readFileSync(diskPath),
	});
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		expectedToast,
	);
};

export const uploadValidNpcs = async (page: Page): Promise<void> => {
	await uploadDat(
		page,
		path.join(FIXTURES, 'npcs/beefyNpcs.dat'),
		'NPCs.dat',
		DATS_MESSAGES.UPLOAD_SUCCESS,
	);
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
		path.join(FIXTURES, 'hechizos/beefyHechizos.dat'),
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

export const uploadValidObj = async (page: Page): Promise<void> => {
	await uploadDat(
		page,
		path.join(FIXTURES, 'obj/beefyObj.dat'),
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
