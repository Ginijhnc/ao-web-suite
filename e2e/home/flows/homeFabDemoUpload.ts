import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
	DEMO_UPLOAD_CANCELLED,
	GRAPHICS_MESSAGES,
} from '@Constants/messages';
import { ROUTES, ROUTES_TITLES } from '@Constants/routes';
import { GENERAL_SELECTORS } from '@Constants/selectors';
import { expect, type Page } from '@playwright/test';
import { OverviewTestHelpers } from '../../overview/helpers/OverviewTestHelpers';
import { GeneralTestHelpers } from '../../shared/helpers/GeneralTestHelpers';
import { SidebarTestHelpers } from '../../shared/helpers/SidebarTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const PUBLIC_GAME_ASSETS = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../../public/game_assets',
);

const resolveFilePath = (dir: string, filename: string): string | null => {
	const exact = path.join(dir, filename);
	if (fs.existsSync(exact)) return exact;
	const lower = filename.toLowerCase();
	const entries = fs.readdirSync(dir);
	const match = entries.find((e) => {
		return e.toLowerCase() === lower;
	});
	return match ? path.join(dir, match) : null;
};

export const uploadViaFabDemoAndNavigate = async (
	page: Page,
): Promise<void> => {
	await page.route('**/game_assets/**', async (route) => {
		const url = new URL(route.request().url());
		const assetPath = url.pathname.replace(/^.*\/game_assets\//, '');
		const parts = assetPath.split('/');
		const filename = parts.pop() ?? '';
		const subdir = path.join(PUBLIC_GAME_ASSETS, ...parts);
		const filePath = resolveFilePath(subdir, filename);
		if (filePath) {
			const contentType = filePath.endsWith('.json')
				? 'application/json'
				: 'application/octet-stream';
			await route.fulfill({
				status: 200,
				contentType,
				body: fs.readFileSync(filePath),
			});
		} else {
			await route.continue();
		}
	});

	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);

	const fab = page.getByRole('button', { name: 'Cargar datos de demo' });
	await expect(fab).toBeVisible();

	await fab.click();

	await expect(
		page.getByText(GRAPHICS_MESSAGES.UPLOAD_SUCCESS),
	).toBeVisible();
	await expect(page.getByText('174 imágenes subidas.')).toBeVisible();
	await expect(fab).not.toBeVisible();

	const siguienteButton = page.getByRole('button', {
		name: 'Siguiente',
	});
	await expect(siguienteButton).toBeEnabled();
	await siguienteButton.click();
	await OverviewTestHelpers.waitForOverviewElements(page);

	await OverviewTestHelpers.assertAssetStats(page);
	await GeneralTestHelpers.assertNoWarnLogs(page);
};

export const uploadViaFabDemoAndNavigateAwayBeforeCompletion = async (
	page: Page,
): Promise<void> => {
	await page.context().route('**/game_assets/**', (route) => {
		setTimeout(() => {
			void route.continue();
		}, 1000);
	});

	await HomeTestHelpers.navigateToHomePage(page);
	await HomeTestHelpers.waitForHomePageElements(page);

	const fab = page.getByRole('button', { name: 'Cargar datos de demo' });
	await expect(fab).toBeVisible();

	await fab.click();

	await expect(
		page.getByText(GRAPHICS_MESSAGES.UPLOAD_SUCCESS),
	).toBeVisible();

	await page.waitForTimeout(100);

	const logsNavLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.LOGS,
	);
	await logsNavLink.click();
	await page.waitForURL(ROUTES.LOGS);

	await expect(page.getByTestId(GENERAL_SELECTORS.TOAST)).toContainText(
		DEMO_UPLOAD_CANCELLED,
	);

	await expect(fab).not.toBeVisible();

	await GeneralTestHelpers.assertLastWarnLogEquals(
		page,
		'Demo FAB upload cancelled: user navigated away before completion.',
	);
};
