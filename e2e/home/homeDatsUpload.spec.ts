import { FILE_TYPES } from '@Constants/database';
import { test } from '@playwright/test';
import {
	rejectDuplicateFields,
	rejectDuplicateIds,
	uploadValidHechizos,
	uploadValidNpcs,
	uploadValidObj,
} from './flows/homeDatsUpload';
import { HomeTestHelpers } from './helpers/HomeTestHelpers';

test.beforeEach(async ({ page }) => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);
	await HomeTestHelpers.selectFileType(page, FILE_TYPES.DATS);
});

test('upload dats: happy path npcs', async ({ page }) => {
	await uploadValidNpcs(page);
});

test('upload dats: happy path hechizos', async ({ page }) => {
	await uploadValidHechizos(page);
});

test('upload dats: happy path obj', async ({ page }) => {
	await uploadValidObj(page);
});

test('upload dats: rejects file with duplicate section IDs', async ({
	page,
}) => {
	await rejectDuplicateIds(page);
});

test('upload dats: rejects file with duplicate field within an entry', async ({
	page,
}) => {
	await rejectDuplicateFields(page);
});
