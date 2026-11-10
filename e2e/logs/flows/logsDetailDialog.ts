import { LOGS_MESSAGES } from '@Constants/messages';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { LogsTestHelpers } from '../helpers/LogsTestHelpers';
import { loadFixture, seedAndNavigate } from './logsSetup';

// Row 0 in default descending sort is id 226de989...
// timestamp 2026-11-05T07:48:40.913Z -> Argentina time: 05/11/2026 04:48
const TARGET_ENTRY_ID = '226de989-1f18-4dbf-9292-4fbedc0db00d';
const TARGET_ROW_INDEX = 0;
const EXPECTED_LEVEL = 'Error';
const EXPECTED_DATE = '05/11/2026 04:48';
/* "SND2" also appears in entry d42a99dc..., but combined with
 * entry index 360 the snippet only matches this entry */
const EXPECTED_MESSAGE_SNIPPET = '"entries",\n      360,\n      "SND2"';

export const assertDetailDialogRendersContent = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	await LogsTestHelpers.openDetailDialog(page, TARGET_ROW_INDEX);

	const dialog = LogsTestHelpers.getDetailDialog(page);
	await expect(dialog).toBeVisible();

	await expect(dialog.getByText('Detalle del log')).toBeVisible();
	const messageText = await dialog.locator('pre').textContent();
	expect(messageText).toContain(EXPECTED_MESSAGE_SNIPPET);
	await expect(dialog.getByText('Nivel:')).toBeVisible();
	await expect(dialog.getByText(EXPECTED_LEVEL)).toBeVisible();
	await expect(dialog.getByText('Fecha:')).toBeVisible();
	await expect(dialog.getByText(EXPECTED_DATE)).toBeVisible();
};

export const assertScrollHintVisibleThenHides = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	await LogsTestHelpers.openDetailDialog(page, TARGET_ROW_INDEX);

	const dialog = LogsTestHelpers.getDetailDialog(page);
	const messageBox = dialog.locator('pre');
	await expect(messageBox).toBeVisible();

	const scrollHint = dialog.getByTestId(GENERAL_SELECTORS.SCROLL_HINT);
	/* The long message from the fixture guarantees overflow.
	The hint must be visible before any scrolling */
	await expect(scrollHint).toHaveCSS('opacity', '0.3');

	/* Hint must disappear as soon as the user scrolls even slightly,
	and stay hidden once they reach the bottom */
	await messageBox.evaluate((el) => {
		el.scrollTop = 1;
	});
	await expect(scrollHint).toHaveCSS('opacity', '0');

	await messageBox.evaluate((el) => {
		el.scrollTop = el.scrollHeight;
	});
	await expect(scrollHint).toHaveCSS('opacity', '0');
};

export const assertCopyButtonBehavior = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	await LogsTestHelpers.openDetailDialog(page, TARGET_ROW_INDEX);

	const dialog = LogsTestHelpers.getDetailDialog(page);
	await page
		.context()
		.grantPermissions(['clipboard-read', 'clipboard-write']);

	const copyButton = dialog.getByRole('button', { name: 'Copiar' });

	// Before clicking: only the copy icon must be present
	await expect(
		copyButton.locator('svg[data-icon="copy"]'),
	).toBeVisible();
	await expect(
		copyButton.locator('svg[data-icon="check"]'),
	).not.toBeAttached();

	await copyButton.click();

	// After clicking: icon swaps to check and success toast appears
	await expect(
		copyButton.locator('svg[data-icon="check"]'),
	).toBeVisible();
	await expect(
		copyButton.locator('svg[data-icon="copy"]'),
	).not.toBeAttached();
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		LOGS_MESSAGES.COPY_SUCCESS,
	);

	const clipboardText = await page.evaluate(() => {
		return navigator.clipboard.readText();
	});
	const entry = loadFixture().find((e) => {
		return e.id === TARGET_ENTRY_ID;
	});
	const fullMessage = entry?.message ?? '';
	// Trim each line to guard against trailing whitespace added by the browser clipboard API
	const normalize = (s: string) => {
		return s
			.split('\n')
			.map((l) => {
				return l.trimEnd();
			})
			.join('\n');
	};
	expect(normalize(clipboardText)).toBe(normalize(fullMessage));

	// Icon reverts to copy after 2 seconds
	await expect(copyButton.locator('svg[data-icon="copy"]')).toBeVisible({
		timeout: 3000,
	});
	await expect(
		copyButton.locator('svg[data-icon="check"]'),
	).not.toBeAttached();
};
