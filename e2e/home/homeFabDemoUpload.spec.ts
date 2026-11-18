import { test } from '@playwright/test';
import {
	uploadViaFabDemoAndNavigate,
	uploadViaFabDemoAndNavigateAwayBeforeCompletion,
} from './flows/homeFabDemoUpload';

test('demo FAB upload: completes successfully and navigates to overview', async ({
	page,
}) => {
	await uploadViaFabDemoAndNavigate(page);
});

test('demo FAB upload: cancels with warning when user navigates away', async ({
	page,
}) => {
	await uploadViaFabDemoAndNavigateAwayBeforeCompletion(page);
});
