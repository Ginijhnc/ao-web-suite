import { ROUTES, ROUTES_TITLES } from '@Constants/routes';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { LogsTestHelpers } from '../../logs/helpers/LogsTestHelpers';
import { SidebarTestHelpers } from '../helpers/SidebarTestHelpers';

const THROTTLED_CONDITIONS = {
	offline: false,
	downloadThroughput: 625000, // bytes/seg (5 Mbps)
	uploadThroughput: 625000, // bytes/seg (5 Mbps)
	latency: 400,
};

const RESET_CONDITIONS = {
	offline: false,
	downloadThroughput: -1,
	uploadThroughput: -1,
	latency: 0,
};

// pnpm test:e2e --headed -- -g "navigation progress bar"

export const assertProgressBarAppearsOnSlowNavigation = async (
	page: Page,
): Promise<void> => {
	await page.goto(ROUTES.RECURSOS, { waitUntil: 'networkidle' });

	const client = await page.context().newCDPSession(page);
	await client.send('Network.enable');
	await client.send('Network.setCacheDisabled', { cacheDisabled: true });
	await client.send(
		'Network.emulateNetworkConditions',
		THROTTLED_CONDITIONS,
	);

	const navLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.LOGS,
	);
	await navLink.click();

	const progressBar = page.getByTestId(
		GENERAL_SELECTORS.NAVIGATION_PROGRESS_BAR,
	);
	await expect(progressBar).toBeVisible();

	await client.send(
		'Network.emulateNetworkConditions',
		RESET_CONDITIONS,
	);

	await expect(progressBar).toBeHidden();
	await LogsTestHelpers.getSearchInput(page).waitFor({
		state: 'visible',
	});
};
