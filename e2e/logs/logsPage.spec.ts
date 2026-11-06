import { test } from '@playwright/test';
import {
	assertEmptyStateWhenNoLogs,
	assertLastPageShowsRemainingEntries,
	assertPage2UpdatesRowsAndSummary,
	assertRowShowsLevelBadgeAndDate,
	assertSortToggleResetsPageAndReversesOrder,
	assertTableRendersFirstPage,
} from './flows/logsPage';

test('logs page: renders table with first page of entries', async ({
	page,
}) => {
	await assertTableRendersFirstPage(page);
});

test('logs page: navigating to page 2 updates rows and summary', async ({
	page,
}) => {
	await assertPage2UpdatesRowsAndSummary(page);
});

test('logs page: last page shows remaining entries', async ({ page }) => {
	await assertLastPageShowsRemainingEntries(page);
});

test('logs page: sort toggle resets to page 1 and reverses order', async ({
	page,
}) => {
	await assertSortToggleResetsPageAndReversesOrder(page);
});

test('logs page: each row shows a level badge and a formatted date', async ({
	page,
}) => {
	await assertRowShowsLevelBadgeAndDate(page);
});

test('logs page: shows "Sin logs" when store is empty', async ({
	page,
}) => {
	await assertEmptyStateWhenNoLogs(page);
});
