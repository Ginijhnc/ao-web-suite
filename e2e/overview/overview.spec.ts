import { test, type Page } from '@playwright/test';
import { uploadAllAssetsAndNavigate } from './flows/overviewSetup';
import { OverviewTestHelpers } from './helpers/OverviewTestHelpers';

test.describe('Overview page', () => {
	/* Serial mode so all tests share a single browser page created in
	 * beforeAll. The full upload flow runs once instead of once per test,
	 * which is safe here because no test mutates the overview page state. */
	test.describe.configure({ mode: 'serial' });

	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		await uploadAllAssetsAndNavigate(page);
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('asset summary shows correct counts for all stat rows', async () => {
		await OverviewTestHelpers.assertAssetStats(page);
	});
});
