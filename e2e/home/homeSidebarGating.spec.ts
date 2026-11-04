import { test } from '@playwright/test';
import { uploadAssetsAndAssertSidebarUnlocks } from './flows/homeSidebarGating';
import { HomeTestHelpers } from './helpers/HomeTestHelpers';

test.beforeEach(async ({ page }) => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);
});

test('sidebar: gated links stay disabled until all assets are uploaded, then unlock', async ({
	page,
}) => {
	await uploadAssetsAndAssertSidebarUnlocks(page);
});
