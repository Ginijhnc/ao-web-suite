import { GENERAL_SELECTORS } from '@Constants/selectors';
import { STORE_NAMES } from '@Constants/storage';
import { expect, type Page } from '@playwright/test';
import type { LogEntry } from '@Stores/logStore';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { LogsTestHelpers } from '../helpers/LogsTestHelpers';
import { loadFixture, seedAndNavigate } from './logsSetup';

const TARGET_ROW_INDEX = 0;

type LogsPersistedState = { state: { entries: ReadonlyArray<LogEntry> } };

export const assertDialogChunkFailureBehaviour = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);

	await page.route(/LogDetailDialog/, (route) => {
		return route.abort();
	});

	await LogsTestHelpers.openDetailDialog(page, TARGET_ROW_INDEX);

	await expect(
		page.getByRole('dialog', { name: 'Detalle del log' }),
	).not.toBeAttached();
	await expect(page.getByRole('table')).toBeVisible();
	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		'No se pudo cargar',
	);

	const stored =
		await GeneralTestHelpers.getLocalStorageItem<LogsPersistedState>(
			page,
			STORE_NAMES.LOGS,
		);
	const chunkError = stored?.state.entries.find((e) => {
		return (
			e.level === 'error' &&
			/dynamically imported module|LogDetailDialog/i.test(e.message)
		);
	});
	// console.log('[chunk error log message]', chunkError?.message);
	expect(chunkError).toBeDefined();
};
