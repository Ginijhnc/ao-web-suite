import fs from 'fs';
import path from 'path';
import { FILE_TYPES } from '@Constants/database';
import {
	GRAPHICS_MESSAGES,
	INDICES_MESSAGES,
	RESOURCES_MESSAGES,
} from '@Constants/messages';
import { expect, type Browser } from '@playwright/test';
import { SidebarTestHelpers } from '../../shared/helpers/SidebarTestHelpers';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';

const VALID_GRAPHIC = path.join(
	process.cwd(),
	'fixtures',
	'graphics',
	'uploads',
	'3082.png',
);

const VALID_ARMAS = path.join(
	process.cwd(),
	'fixtures',
	'indices',
	'armas',
	'valid',
	'armas.json',
);

const INVALID_INDICE = path.join(
	process.cwd(),
	'fixtures',
	'indices',
	'armas',
	'invalid-entry',
	'armas.json',
);

export const graphicsVisibleInSecondTab = async (
	browser: Browser,
): Promise<void> => {
	const context = await browser.newContext();
	const tabA = await context.newPage();
	const tabB = await context.newPage();

	await HomeTestHelpers.navigateToHomePage(tabA);
	await HomeTestHelpers.waitForHomePageElements(tabA);
	await HomeTestHelpers.navigateToHomePage(tabB);
	await HomeTestHelpers.waitForHomePageElements(tabB);

	await expect(
		tabB.getByText('Falta subir los gráficos.'),
	).toBeVisible();

	await HomeTestHelpers.uploadGraphics(
		tabA,
		[VALID_GRAPHIC],
		GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
	);
	await expect(tabA.getByText('1 imagen subida.')).toBeVisible();

	await tabB.bringToFront();
	await expect(tabB.getByText('1 imagen subida.')).toBeVisible();

	await context.close();
};

export const logCountSyncsToSecondTab = async (
	browser: Browser,
): Promise<void> => {
	const context = await browser.newContext();
	const tabA = await context.newPage();
	const tabB = await context.newPage();

	await HomeTestHelpers.navigateToHomePage(tabA);
	await HomeTestHelpers.waitForHomePageElements(tabA);
	await HomeTestHelpers.selectFileType(tabA, FILE_TYPES.INDICES);

	await HomeTestHelpers.navigateToHomePage(tabB);
	await HomeTestHelpers.waitForHomePageElements(tabB);

	const logsBadgeA = SidebarTestHelpers.getLogsBadge(tabA);
	const logsBadgeB = SidebarTestHelpers.getLogsBadge(tabB);

	await HomeTestHelpers.triggerUpload(tabA, {
		name: 'armas.json',
		mimeType: 'application/json',
		buffer: fs.readFileSync(INVALID_INDICE),
	});
	await HomeTestHelpers.expectUploadErrorDialog(
		tabA,
		INDICES_MESSAGES.SCHEMA_MISMATCH('armas.json'),
	);

	await expect(logsBadgeA).toHaveText('1');

	await tabB.bringToFront();
	await expect(logsBadgeB).toHaveText('1');

	await context.close();
};

export const clearedIndicesDisappearInSecondTab = async (
	browser: Browser,
): Promise<void> => {
	const context = await browser.newContext();
	const tabA = await context.newPage();
	const tabB = await context.newPage();

	await HomeTestHelpers.navigateToHomePage(tabA);
	await HomeTestHelpers.waitForHomePageElements(tabA);
	await HomeTestHelpers.selectFileType(tabA, FILE_TYPES.INDICES);

	await HomeTestHelpers.navigateToHomePage(tabB);
	await HomeTestHelpers.waitForHomePageElements(tabB);
	await HomeTestHelpers.selectFileType(tabB, FILE_TYPES.INDICES);

	await HomeTestHelpers.triggerUpload(tabA, {
		name: 'armas.json',
		mimeType: 'application/json',
		buffer: fs.readFileSync(VALID_ARMAS),
	});
	await expect(
		tabA.getByText(INDICES_MESSAGES.UPLOAD_SUCCESS),
	).toBeVisible();

	await tabB.bringToFront();
	await expect(
		tabB.getByText('armas.json').locator('..').getByLabel('subido'),
	).toBeVisible();

	await tabA.bringToFront();
	await HomeTestHelpers.getClearButton(tabA).click();
	await HomeTestHelpers.confirmAssetClearDialog(
		tabA,
		FILE_TYPES.INDICES,
	);
	await expect(
		tabA.getByText(
			RESOURCES_MESSAGES.CLEAR_SUCCESS(FILE_TYPES.INDICES),
		),
	).toBeVisible();

	await tabB.bringToFront();
	await expect(
		tabB.getByText('armas.json').locator('..').getByLabel('faltante'),
	).toBeVisible();

	await context.close();
};
