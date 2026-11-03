import { DATS_MESSAGES } from '@Constants/messages';
import { test, type Page } from '@playwright/test';
import { uploadAssetsWithRejectedDatAndNavigate } from './flows/overviewLogsSetup';
import { uploadAllAssetsAndNavigate } from './flows/overviewSetup';
import { OverviewTestHelpers } from './helpers/OverviewTestHelpers';

/* Happy-path snapshot tests: assert the default state of the Overview
   page after a clean asset upload. Mutation tests (e.g. pending export
   changes) will live in a separate spec file. */
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

	test('pending changes card shows empty state', async () => {
		await OverviewTestHelpers.assertPendingChangesEmptyState(page);
	});

	test('logs card shows empty state', async () => {
		await OverviewTestHelpers.assertLogsEmptyState(page);
	});
});

test.describe('Overview page with a rejected dat upload log', () => {
	test('logs card shows the validation error', async ({ page }) => {
		await uploadAssetsWithRejectedDatAndNavigate(page);
		await OverviewTestHelpers.assertLogsShowsEntry(
			page,
			'Error',
			DATS_MESSAGES.DUPLICATE_FIELDS(
				'Hechizos.dat',
				'HECHIZO35: SubeHP, MinHP, MaxHP',
			),
		);
	});
});
