import { test } from '@playwright/test';
import { assertProgressBarAppearsOnSlowNavigation } from './flows/navigationProgressBar';

test('navigation progress bar: appears during slow navigation and disappears when done', async ({
	page,
}) => {
	await assertProgressBarAppearsOnSlowNavigation(page);
});
