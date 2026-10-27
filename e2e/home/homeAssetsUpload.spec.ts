import { test } from '@playwright/test';
import {
	uploadValidGraphics,
	uploadBatchWithConflict,
	uploadBatchWithMultipleConflicts,
	clearGraphics,
	uploadSameFileForReplacement,
	rejectReplacementWithDifferentExtension,
} from './flows/homeAssetsUpload';
import { HomeTestHelpers } from './helpers/HomeTestHelpers';

test.beforeEach(async ({ page }) => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);
});

test('upload graphics: happy path', async ({ page }) => {
	await uploadValidGraphics(page);
});

test('upload graphics: rejects batch with same basename and different extension', async ({
	page,
}) => {
	await uploadBatchWithConflict(page);
});

test('upload graphics: rejects batch with multiple format conflicts', async ({
	page,
}) => {
	await uploadBatchWithMultipleConflicts(page);
});

test('clear graphics: removes uploaded files', async ({ page }) => {
	await clearGraphics(page);
});

test('replace graphics: allows uploading the same file (same name and extension)', async ({
	page,
}) => {
	await uploadSameFileForReplacement(page);
});

test('replace graphics: rejects if same basename with different extension already exists in IDB', async ({
	page,
}) => {
	await rejectReplacementWithDifferentExtension(page);
});
