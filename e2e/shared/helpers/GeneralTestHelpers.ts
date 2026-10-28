import fs from 'fs';
import path from 'path';
import { expect, type Page } from '@playwright/test';
import type { StoreName } from '@Types/database';

const getFilePathsFromDirectory = (dir: string): Array<string> => {
	return fs
		.readdirSync(dir)
		.filter((f) => {
			return fs.statSync(path.join(dir, f)).isFile();
		})
		.map((f) => {
			return path.join(dir, f);
		});
};

const assertIdbStoreHasKeys = async (
	page: Page,
	dbName: string,
	storeName: StoreName,
	expectedKeys: Array<string>,
): Promise<void> => {
	const keys = await page.evaluate(
		({
			db,
			store,
		}: {
			db: string;
			store: string;
		}): Promise<Array<string>> => {
			return new Promise((resolve) => {
				const request = indexedDB.open(db);
				request.onsuccess = () => {
					const tx = request.result.transaction(
						store,
						'readonly',
					);
					const keysRequest = tx.objectStore(store).getAllKeys();
					keysRequest.onsuccess = () => {
						resolve(keysRequest.result as Array<string>);
					};
				};
			});
		},
		{ db: dbName, store: storeName },
	);
	expect(keys).toEqual(expect.arrayContaining(expectedKeys));
	expect(keys).toHaveLength(expectedKeys.length);
};

const getIdbEntry = async (
	page: Page,
	dbName: string,
	storeName: StoreName,
	key: string,
): Promise<unknown> => {
	return page.evaluate(
		({
			db,
			store,
			k,
		}: {
			db: string;
			store: string;
			k: string;
		}): Promise<unknown> => {
			return new Promise((resolve) => {
				const request = indexedDB.open(db);
				request.onsuccess = () => {
					const tx = request.result.transaction(
						store,
						'readonly',
					);
					const getRequest = tx.objectStore(store).get(k);
					getRequest.onsuccess = () => {
						resolve(getRequest.result);
					};
				};
			});
		},
		{ db: dbName, store: storeName, k: key },
	);
};

const assertIdbStoreHasEntry = async (
	page: Page,
	dbName: string,
	storeName: StoreName,
	key: string,
	expectedValue: unknown,
): Promise<void> => {
	const value = await page.evaluate(
		({
			db,
			store,
			k,
		}: {
			db: string;
			store: string;
			k: string;
		}): Promise<unknown> => {
			return new Promise((resolve) => {
				const request = indexedDB.open(db);
				request.onsuccess = () => {
					const tx = request.result.transaction(
						store,
						'readonly',
					);
					const getRequest = tx.objectStore(store).get(k);
					getRequest.onsuccess = () => {
						resolve(getRequest.result);
					};
				};
			});
		},
		{ db: dbName, store: storeName, k: key },
	);
	expect(value).toEqual(expectedValue);
};

const assertIdbStoreIsEmpty = async (
	page: Page,
	dbName: string,
	storeName: StoreName,
): Promise<void> => {
	const keys = await page.evaluate(
		({
			db,
			store,
		}: {
			db: string;
			store: string;
		}): Promise<Array<string>> => {
			return new Promise((resolve) => {
				const request = indexedDB.open(db);
				request.onsuccess = () => {
					const tx = request.result.transaction(
						store,
						'readonly',
					);
					const keysRequest = tx.objectStore(store).getAllKeys();
					keysRequest.onsuccess = () => {
						resolve(keysRequest.result as Array<string>);
					};
				};
			});
		},
		{ db: dbName, store: storeName },
	);
	expect(keys).toHaveLength(0);
};

export const GeneralTestHelpers = {
	getFilePathsFromDirectory,
	getIdbEntry,
	assertIdbStoreHasKeys,
	assertIdbStoreHasEntry,
	assertIdbStoreIsEmpty,
};
