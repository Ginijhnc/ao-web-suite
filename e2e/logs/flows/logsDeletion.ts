import { LOGS_MESSAGES } from '@Constants/messages';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { LogsTestHelpers } from '../helpers/LogsTestHelpers';
import { loadFixture, seedAndNavigate } from './logsSetup';

const TARGET_ROW_INDEX = 0;
// Row 0 in default descending sort - timestamp 2026-11-05T07:48:40.913Z
const TARGET_ROW_DATE = '05/11/2026 04:48';

export const assertDeleteDialogRendersContent = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	await LogsTestHelpers.openDeleteDialog(page, TARGET_ROW_INDEX);

	const dialog = LogsTestHelpers.getDeleteDialog(page);
	await expect(dialog).toBeVisible();
	await expect(
		dialog.getByText(LOGS_MESSAGES.DELETE_CONFIRM),
	).toBeVisible();
	await expect(
		dialog.getByRole('button', { name: 'Eliminar' }),
	).toBeVisible();
	await expect(
		dialog.getByRole('button', { name: 'Cancelar' }),
	).toBeVisible();
};

export const assertDeleteCancelKeepsRow = async (
	page: Page,
): Promise<void> => {
	const fixture = loadFixture();
	await seedAndNavigate(page, fixture);
	await LogsTestHelpers.waitForLogsTable(page);

	const summaryBefore =
		await LogsTestHelpers.getPaginationSummary(page).textContent();
	await LogsTestHelpers.openDeleteDialog(page, TARGET_ROW_INDEX);

	const dialog = LogsTestHelpers.getDeleteDialog(page);
	const cancelButton = dialog.getByRole('button', { name: 'Cancelar' });
	await cancelButton.click();

	await expect(dialog).not.toBeAttached();
	await expect(LogsTestHelpers.getPaginationSummary(page)).toHaveText(
		summaryBefore ?? '',
	);
};

export const assertDeleteConfirmRemovesRow = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	await expect(LogsTestHelpers.getPaginationSummary(page)).toContainText(
		'de 71',
	);

	await LogsTestHelpers.openDeleteDialog(page, TARGET_ROW_INDEX);

	const dialog = LogsTestHelpers.getDeleteDialog(page);
	const confirmButton = dialog.getByRole('button', { name: 'Eliminar' });
	await confirmButton.click();

	await expect(dialog).not.toBeAttached();
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		LOGS_MESSAGES.DELETE_SUCCESS,
	);
	await expect(LogsTestHelpers.getPaginationSummary(page)).toContainText(
		'de 70',
	);
	await expect(
		page.getByRole('table').getByText(TARGET_ROW_DATE),
	).not.toBeAttached();
};
