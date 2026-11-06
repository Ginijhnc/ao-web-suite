import { expect, type Page } from '@playwright/test';
import { LogsTestHelpers } from '../helpers/LogsTestHelpers';
import { loadFixture, seedAndNavigate } from './logsSetup';

const FIXTURE_TOTAL = 71;
const LAST_PAGE = 8;
const ROWS_PER_PAGE = 10;

export const assertTableRendersFirstPage = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	await expect(LogsTestHelpers.getBodyRows(page)).toHaveCount(
		ROWS_PER_PAGE,
	);
	await expect(LogsTestHelpers.getPaginationSummary(page)).toHaveText(
		`Mostrando 1-10 de ${FIXTURE_TOTAL}`,
	);
};

export const assertPage2UpdatesRowsAndSummary = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);

	const firstRowMessage = await LogsTestHelpers.getBodyRows(page)
		.first()
		.locator('td')
		.nth(2)
		.innerText();

	await page.getByRole('button', { name: '2' }).click();
	await expect(LogsTestHelpers.getPaginationSummary(page)).toHaveText(
		`Mostrando 11-20 de ${FIXTURE_TOTAL}`,
	);
	await expect(LogsTestHelpers.getBodyRows(page)).toHaveCount(
		ROWS_PER_PAGE,
	);
	await expect(
		page
			.getByRole('table')
			.getByText(firstRowMessage, { exact: true }),
	).not.toBeAttached();
};

export const assertLastPageShowsRemainingEntries = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);

	const firstRowMessage = await LogsTestHelpers.getBodyRows(page)
		.first()
		.locator('td')
		.nth(2)
		.innerText();

	await page.getByRole('button', { name: String(LAST_PAGE) }).click();
	const lastPageRowCount =
		FIXTURE_TOTAL % ROWS_PER_PAGE || ROWS_PER_PAGE;
	const firstOnLastPage = FIXTURE_TOTAL - lastPageRowCount + 1;
	await expect(LogsTestHelpers.getPaginationSummary(page)).toHaveText(
		`Mostrando ${firstOnLastPage}-${FIXTURE_TOTAL} de ${FIXTURE_TOTAL}`,
	);
	await expect(LogsTestHelpers.getBodyRows(page)).toHaveCount(
		lastPageRowCount,
	);
	await expect(
		page
			.getByRole('table')
			.getByText(firstRowMessage, { exact: true }),
	).not.toBeAttached();
};

export const assertSortToggleResetsPageAndReversesOrder = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);

	await page.getByRole('button', { name: '2' }).click();
	await expect(LogsTestHelpers.getPaginationSummary(page)).toHaveText(
		`Mostrando 11-20 de ${FIXTURE_TOTAL}`,
	);

	const sortButton = LogsTestHelpers.getSortButton(page);
	await expect(sortButton).toHaveAccessibleName(
		'Ordenar por fecha ascendente',
	);

	const firstRowMessageDesc = await LogsTestHelpers.getBodyRows(page)
		.first()
		.locator('td')
		.nth(2)
		.innerText();

	await sortButton.click();
	await expect(LogsTestHelpers.getPaginationSummary(page)).toHaveText(
		`Mostrando 1-10 de ${FIXTURE_TOTAL}`,
	);
	await expect(sortButton).toHaveAccessibleName(
		'Ordenar por fecha descendente',
	);
	await expect(
		page
			.getByRole('table')
			.getByText(firstRowMessageDesc, { exact: true }),
	).not.toBeAttached();
};

const SECOND_ROW_MESSAGE =
	'"obj.dat" no tiene la estructura esperada. Revisá los logs para más información.';

export const assertRowShowsLevelBadgeAndDate = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, loadFixture());
	await LogsTestHelpers.waitForLogsTable(page);
	const firstRow = LogsTestHelpers.getBodyRows(page).first();
	const levelCell = firstRow.locator('td').first();
	await expect(levelCell.getByText(/^(Error|Warn)$/)).toBeVisible();
	const dateCell = firstRow.locator('td').nth(1);
	// Fixture is stable test data, so the expected date is hardcoded
	await expect(dateCell.getByText('05/11/2026 04:48')).toBeVisible();
	const secondRow = LogsTestHelpers.getBodyRows(page).nth(1);
	await expect(
		secondRow.getByText(SECOND_ROW_MESSAGE, { exact: true }),
	).toBeVisible();
};

export const assertEmptyStateWhenNoLogs = async (
	page: Page,
): Promise<void> => {
	await seedAndNavigate(page, []);
	await expect(page.getByRole('table')).not.toBeAttached();
	await expect(
		page.getByText('Sin logs', { exact: true }),
	).toBeVisible();
	await expect(
		page.getByText('No hay logs disponibles aún.', { exact: true }),
	).toBeVisible();
};
