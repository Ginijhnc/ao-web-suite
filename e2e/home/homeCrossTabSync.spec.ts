import { test } from '@playwright/test';
import {
	graphicsVisibleInSecondTab,
	logCountSyncsToSecondTab,
} from './flows/homeCrossTabSync';

test('cross-tab sync: graphics uploaded in one tab appear in another', async ({
	browser,
}) => {
	await graphicsVisibleInSecondTab(browser);
});

test('cross-tab sync: log count updates in both tabs after invalid indice upload', async ({
	browser,
}) => {
	await logCountSyncsToSecondTab(browser);
});
