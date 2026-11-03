import { ROUTES } from '@Constants/routes';
import { expect, type Page } from '@playwright/test';

// Counts parsed from the real game files in the public folder
const expectedStats: ReadonlyArray<[string, number]> = [
	['Gráficos', 174],
	['NPCs', 337],
	['Objetos', 1049],
	['Hechizos', 46],
	['Armas', 75],
	['Cabezas', 514],
	['Cascos', 16],
	['Cuerpos', 548],
	['Escudos', 9],
	['FXs', 35],
	['GRHs', 23558],
	['Mapas', 0],
];

const navigateToOverviewPage = async (page: Page): Promise<void> => {
	await page.goto(ROUTES.OVERVIEW, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
};

const waitForOverviewElements = async (page: Page): Promise<void> => {
	await page.getByText('Assets').waitFor({ state: 'visible' });
	await page
		.getByText('Cambios sin exportar')
		.waitFor({ state: 'visible' });
};

const assertStatRow = async (
	page: Page,
	label: string,
	expectedCount: string,
): Promise<void> => {
	const row = page
		.getByText(label, { exact: true })
		.locator('..')
		.getByText(expectedCount, { exact: true });
	await expect(row).toBeVisible();
};

const assertAssetStats = async (page: Page): Promise<void> => {
	await Promise.all(
		expectedStats.map(([label, count]) => {
			return assertStatRow(
				page,
				label,
				count.toLocaleString('es-AR'),
			);
		}),
	);
};

const assertPendingChangesEmptyState = async (
	page: Page,
): Promise<void> => {
	await expect(
		page.getByText('Cambios sin exportar', { exact: true }),
	).toBeVisible();
	await expect(
		page.getByText('No hay cambios para exportar.', { exact: true }),
	).toBeVisible();
};

export const OverviewTestHelpers = {
	navigateToOverviewPage,
	waitForOverviewElements,
	assertStatRow,
	assertAssetStats,
	assertPendingChangesEmptyState,
};
