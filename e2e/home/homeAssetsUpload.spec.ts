import { test } from '@playwright/test';
import {
	uploadValidGraphics,
	uploadBatchWithConflict,
	uploadBatchWithMultipleConflicts,
	clearGraphics,
	dismissClearGraphicsDialog,
	uploadSameFileForReplacement,
	rejectReplacementWithDifferentExtension,
	showsSpinnerAndDisablesActionsDuringUpload,
	uploadContinuesInBackgroundAfterNavigatingAway,
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

test('clear graphics: dismissing the dialog does not delete files', async ({
	page,
}) => {
	await dismissClearGraphicsDialog(page);
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

test('upload graphics: shows a spinner and disables Subir/Borrar during an upload', async ({
	page,
}) => {
	await showsSpinnerAndDisablesActionsDuringUpload(page);
});

test('upload graphics: continues in the background after navigating away mid-upload', async ({
	page,
}) => {
	await uploadContinuesInBackgroundAfterNavigatingAway(page);
});
