import { FILE_TYPES } from '@Constants/database';
import { ROUTES_TITLES } from '@Constants/routes';
import type { Page } from '@playwright/test';
import { HomeTestHelpers } from '../helpers/HomeTestHelpers';
import { SidebarTestHelpers } from '../helpers/SidebarTestHelpers';
import { uploadPublicGraphics } from './homeAssetsUpload';
import { uploadPublicDats } from './homeDatsUpload';
import { uploadPublicIndices } from './homeIndicesUpload';

const ASSET_GATED_LINKS = [
	ROUTES_TITLES.OVERVIEW,
	ROUTES_TITLES.INDEXADOR,
	ROUTES_TITLES.DATEADOR,
] as const;

const ALWAYS_ENABLED_LINKS = [
	ROUTES_TITLES.ROOT,
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
