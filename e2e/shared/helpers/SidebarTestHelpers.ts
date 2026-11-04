import type { RouteTitleValue } from '@Constants/routes';
import { expect, type Locator, type Page } from '@playwright/test';

const getNavLink = (page: Page, label: RouteTitleValue): Locator => {
	return page
		.getByRole('navigation', { name: 'Navegación principal' })
		.getByRole('button', { name: label });
};

const assertLinksDisabled = async (
	page: Page,
	labels: ReadonlyArray<RouteTitleValue>,
): Promise<void> => {
	await Promise.all(
		labels.map((label) => {
			return expect(getNavLink(page, label)).toBeDisabled();
		}),
	);
};

const assertLinksEnabled = async (
	page: Page,
	labels: ReadonlyArray<RouteTitleValue>,
): Promise<void> => {
	await Promise.all(
		labels.map((label) => {
			return expect(getNavLink(page, label)).toBeEnabled();
		}),
	);
};

const getNavLandmark = (page: Page): Locator => {
	return page.getByRole('navigation', { name: 'Navegación principal' });
};

const collapseSidebar = async (page: Page): Promise<void> => {
	await getNavLandmark(page)
		.getByRole('button', { name: 'Contraer menú' })
		.click();
};

const expandSidebar = async (page: Page): Promise<void> => {
	await getNavLandmark(page)
		.getByRole('button', { name: 'Expandir menú' })
		.click();
};

const getTooltip = (page: Page, label: RouteTitleValue): Locator => {
	return page.getByRole('tooltip', { name: label });
};

export const SidebarTestHelpers = {
	getNavLink,
	assertLinksDisabled,
	assertLinksEnabled,
	collapseSidebar,
	expandSidebar,
	getTooltip,
};
