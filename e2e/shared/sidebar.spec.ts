import { test } from '@playwright/test';
import { HomeTestHelpers } from '../home/helpers/HomeTestHelpers';
import {
	assertLogsBadgeAbsentWithNoLogs,
	assertLogsBadgeAppearsAfterUploadError,
	assertNoTooltipAfterReexpandingSidebar,
	assertNoTooltipOnExpandedSidebar,
	assertTooltipOnCollapsedSidebarDisabledLink,
	assertTooltipOnCollapsedSidebarEnabledLink,
	uploadAssetsAndAssertSidebarUnlocks,
} from './flows/sidebarBehavior';

test.beforeEach(async ({ page }) => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);
});

test('sidebar: gated links stay disabled until all assets are uploaded, then unlock', async ({
	page,
}) => {
	await uploadAssetsAndAssertSidebarUnlocks(page);
});

test('sidebar: tooltip does not appear while the sidebar is expanded', async ({
	page,
}) => {
	await assertNoTooltipOnExpandedSidebar(page);
});

test('sidebar: tooltip appears on hover for an enabled link once collapsed', async ({
	page,
}) => {
	await assertTooltipOnCollapsedSidebarEnabledLink(page);
});

test('sidebar: tooltip appears on hover for a disabled link once collapsed', async ({
	page,
}) => {
	await assertTooltipOnCollapsedSidebarDisabledLink(page);
});

test('sidebar: tooltip stops appearing after re-expanding the sidebar', async ({
	page,
}) => {
	await assertNoTooltipAfterReexpandingSidebar(page);
});

test('sidebar: logs badge is absent when there are no log entries', async ({
	page,
}) => {
	await assertLogsBadgeAbsentWithNoLogs(page);
});

test('sidebar: logs badge appears after an upload error is logged', async ({
	page,
}) => {
	await assertLogsBadgeAppearsAfterUploadError(page);
});
