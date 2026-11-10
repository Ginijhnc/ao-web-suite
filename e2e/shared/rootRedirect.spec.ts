import { test } from '@playwright/test';
import { HomeTestHelpers } from '../home/helpers/HomeTestHelpers';
import {
	redirectsToPanelWithAssetsLoaded,
	redirectsToRecursosWithNoAssets,
} from './flows/rootRedirectBehavior';

test.beforeEach(async ({ page }) => {
	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);
});

test('root redirect: sends users with no assets to /recursos', async ({
	page,
}) => {
	await redirectsToRecursosWithNoAssets(page);
});

test('root redirect: sends users with all assets loaded to /panel', async ({
	page,
}) => {
	await redirectsToPanelWithAssetsLoaded(page);
});
