import { FILE_TYPES } from '@Constants/database';
import { test } from '@playwright/test';
import {
	uploadValidIndices,
	replaceIndice,
	rejectUnknownIndice,
	rejectMalformedJson,
	rejectInvalidShape,
	rejectInvalidEntry,
	rejectEmptyIndice,
	clearIndices,
	clearIndicesLeavesGraphicsIntact,
} from './flows/homeIndicesUpload';
import { HomeTestHelpers } from './helpers/HomeTestHelpers';

test.beforeEach(async ({ page }) => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);
	await HomeTestHelpers.selectFileType(page, FILE_TYPES.INDICES);
});

test('upload indices: happy path', async ({ page }) => {
	await uploadValidIndices(page);
});

test('upload indices: replacement toast for repeat upload', async ({
	page,
}) => {
	await replaceIndice(page);
});

test('upload indices: rejects unknown basename', async ({ page }) => {
	await rejectUnknownIndice(page);
});

test('upload indices: rejects malformed JSON', async ({ page }) => {
	await rejectMalformedJson(page);
});

test('upload indices: rejects when the JSON is not an array', async ({
	page,
}) => {
	await rejectInvalidShape(page);
});

test('upload indices: rejects when an entry has the wrong field type', async ({
	page,
}) => {
	await rejectInvalidEntry(page);
});

test('upload indices: rejects empty file', async ({ page }) => {
	await rejectEmptyIndice(page);
});

test('clear indices: removes uploaded files and shows toast', async ({
	page,
}) => {
	await clearIndices(page);
});

test('clear indices: does not affect the graphics store', async ({
	page,
}) => {
	await clearIndicesLeavesGraphicsIntact(page);
});
