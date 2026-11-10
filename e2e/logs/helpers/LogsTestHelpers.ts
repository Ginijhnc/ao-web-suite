import { LOGS_SELECTORS } from '@Constants/selectors';
import { type Locator, type Page } from '@playwright/test';

const waitForLogsTable = async (page: Page): Promise<void> => {
	await page.getByRole('table').waitFor({ state: 'visible' });
};

const getBodyRows = (page: Page): Locator => {
	return page.getByRole('table').locator('tbody').getByRole('row');
};

const getPaginationSummary = (page: Page): Locator => {
	return page.getByTestId(LOGS_SELECTORS.PAGINATION_SUMMARY);
};

const getSortButton = (page: Page): Locator => {
	return page.getByRole('button', { name: /Ordenar por fecha/ });
};

const getSearchInput = (page: Page): Locator => {
	return page.getByPlaceholder('Buscar por mensaje');
};

const openDetailDialog = async (
	page: Page,
	rowIndex: number,
): Promise<void> => {
	const row = getBodyRows(page).nth(rowIndex);
	const menuButton = row.getByRole('button', {
		name: 'Ver mensaje completo',
	});
	await menuButton.click();
	const menuItem = page.getByRole('menuitem', { name: 'Ver detalle' });
	await menuItem.click();
};

const getDetailDialog = (page: Page): Locator => {
	return page.getByRole('dialog', { name: 'Detalle del log' });
};

export const LogsTestHelpers = {
	waitForLogsTable,
	getBodyRows,
	getPaginationSummary,
	getSortButton,
	getSearchInput,
	openDetailDialog,
	getDetailDialog,
};
