import { test } from '@playwright/test';
import {
	clearedIndicesDisappearInSecondTab,
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

test('cross-tab sync: clearing indices in one tab updates another', async ({
	browser,
}) => {
	await clearedIndicesDisappearInSecondTab(browser);
});
