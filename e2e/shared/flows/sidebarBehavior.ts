import { FILE_TYPES } from '@Constants/database';
import { ROUTES_TITLES } from '@Constants/routes';
import { expect, type Page } from '@playwright/test';
import { uploadPublicGraphics } from '../../home/flows/homeAssetsUpload';
import { uploadPublicDats } from '../../home/flows/homeDatsUpload';
import { uploadPublicIndices } from '../../home/flows/homeIndicesUpload';
import { HomeTestHelpers } from '../../home/helpers/HomeTestHelpers';
import { SidebarTestHelpers } from '../helpers/SidebarTestHelpers';

/* Deliberately more than the Tooltip component's own TOOLTIP_ENTER_DELAY_MS
   so the assertion isn't flaky against timing jitter. */
const TOOLTIP_HOVER_WAIT_MS = 500;

const ASSET_GATED_LINKS = [
	ROUTES_TITLES.OVERVIEW,
	ROUTES_TITLES.INDEXADOR,
	ROUTES_TITLES.DATEADOR,
] as const;

const ALWAYS_ENABLED_LINKS = [
	ROUTES_TITLES.RECURSOS,
	ROUTES_TITLES.TUTORIAL,
	ROUTES_TITLES.LOGS,
	ROUTES_TITLES.CONFIGURACION,
] as const;

export const uploadAssetsAndAssertSidebarUnlocks = async (
	page: Page,
): Promise<void> => {
	// Baseline: nothing uploaded yet, so every asset-gated link is locked.
	await SidebarTestHelpers.assertLinksDisabled(page, ASSET_GATED_LINKS);
	await SidebarTestHelpers.assertLinksDisabled(page, [
		ROUTES_TITLES.MAPEADOR,
	]);
	await SidebarTestHelpers.assertLinksEnabled(
		page,
		ALWAYS_ENABLED_LINKS,
	);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.INDICES);
	await uploadPublicIndices(page);
	/* One of three required asset types uploaded: gating must hold, not
	   unlock early on a partial match. */
	await SidebarTestHelpers.assertLinksDisabled(page, ASSET_GATED_LINKS);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.GRAPHICS);
	await uploadPublicGraphics(page);
	// Two of three uploaded: still gated, same reasoning as above.
	await SidebarTestHelpers.assertLinksDisabled(page, ASSET_GATED_LINKS);

	await HomeTestHelpers.selectFileType(page, FILE_TYPES.DATS);
	await uploadPublicDats(page);

	await SidebarTestHelpers.assertLinksEnabled(page, ASSET_GATED_LINKS);
	// Mapeador is disabled unconditionally, independent of asset state.
	await SidebarTestHelpers.assertLinksDisabled(page, [
		ROUTES_TITLES.MAPEADOR,
	]);
};

export const assertNoTooltipOnExpandedSidebar = async (
	page: Page,
): Promise<void> => {
	const navLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.TUTORIAL,
	);
	await navLink.hover();
	await page.waitForTimeout(TOOLTIP_HOVER_WAIT_MS);

	const tooltip = SidebarTestHelpers.getTooltip(
		page,
		ROUTES_TITLES.TUTORIAL,
	);
	await expect(tooltip).toBeHidden();
};

export const assertTooltipOnCollapsedSidebarEnabledLink = async (
	page: Page,
): Promise<void> => {
	await SidebarTestHelpers.collapseSidebar(page);

	const navLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.TUTORIAL,
	);
	await navLink.hover();

	const tooltip = SidebarTestHelpers.getTooltip(
		page,
		ROUTES_TITLES.TUTORIAL,
	);
	await expect(tooltip).toBeVisible();
};

export const assertTooltipOnCollapsedSidebarDisabledLink = async (
	page: Page,
): Promise<void> => {
	await SidebarTestHelpers.collapseSidebar(page);

	const navLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.MAPEADOR,
	);
	await navLink.hover();

	const tooltip = SidebarTestHelpers.getTooltip(
		page,
		ROUTES_TITLES.MAPEADOR,
	);
	await expect(tooltip).toBeVisible();
};

export const assertNoTooltipAfterReexpandingSidebar = async (
	page: Page,
): Promise<void> => {
	await SidebarTestHelpers.collapseSidebar(page);
	await SidebarTestHelpers.expandSidebar(page);

	const navLink = SidebarTestHelpers.getNavLink(
		page,
		ROUTES_TITLES.TUTORIAL,
	);
	await navLink.hover();
	await page.waitForTimeout(TOOLTIP_HOVER_WAIT_MS);

	const tooltip = SidebarTestHelpers.getTooltip(
		page,
		ROUTES_TITLES.TUTORIAL,
	);
	await expect(tooltip).toBeHidden();
};
