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

export const SidebarTestHelpers = {
	getNavLink,
	assertLinksDisabled,
	assertLinksEnabled,
};
