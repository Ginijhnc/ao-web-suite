import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTES } from '@Constants/routes';
import { STORE_NAMES } from '@Constants/storage';
import type { Page } from '@playwright/test';
import type { LogEntry } from '@Stores/logStore';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.resolve(
	dirName,
	'../../../fixtures/logs/logs_fixture.json',
);

export const loadFixture = (): ReadonlyArray<LogEntry> => {
	const raw = fs
		.readFileSync(FIXTURE_PATH, 'utf-8')
		.replace(/^\uFEFF/, '');
	return JSON.parse(raw) as ReadonlyArray<LogEntry>;
};

export const seedAndNavigate = async (
	page: Page,
	entries: ReadonlyArray<LogEntry>,
): Promise<void> => {
	await page.addInitScript(
		({
			key,
			stored,
		}: {
			key: string;
			stored: ReadonlyArray<LogEntry>;
		}) => {
			localStorage.setItem(
				key,
				JSON.stringify({ state: { entries: stored }, version: 0 }),
			);
		},
		{ key: STORE_NAMES.LOGS, stored: entries },
	);
	await page.goto(ROUTES.LOGS, { waitUntil: 'domcontentloaded' });
	await page.waitForLoadState('networkidle');
};
