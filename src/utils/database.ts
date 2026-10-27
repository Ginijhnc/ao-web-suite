/*
 * Future improvements:
 * - Offload file reading and IDB writes to a Web Worker to avoid blocking the main thread
 *   during large uploads.
 */

import { DB_NAME, DB_STORE_NAMES, DB_VERSION } from '@Constants/database';
import type {
	DeleteResult,
	GetResult,
	NamedRecord,
	StoredFile,
	StoreName,
} from '@Types/database';
import { log } from '@Utils/logger';

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Returns a singleton IDBDatabase instance, opening it on first call.
 * Invalidates the cache if the connection is closed or superseded by
 * a newer database version.
 */
const getDb = (): Promise<IDBDatabase> => {
	if (dbPromise) {
		return dbPromise;
	}

	dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;
			for (const storeName of Object.values(DB_STORE_NAMES)) {
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: 'name' });
				}
			}
		};

		request.onsuccess = () => {
			const db = request.result;

			db.onclose = () => {
				dbPromise = null;
			};

			db.onversionchange = () => {
				db.close();
				dbPromise = null;
			};

			resolve(db);
		};

		request.onerror = () => {
			dbPromise = null;
			reject(
				new Error(
					`No se pudo abrir la base de datos: ${request.error?.message}`,
				),
			);
		};
	});

	return dbPromise;
};

/**
 * Writes multiple files to a store in a single transaction. Any per-file
 * error aborts the entire transaction and rejects the returned promise.
 */
export const putFiles = async (
	storeName: StoreName,
	files: ReadonlyArray<NamedRecord>,
): Promise<void> => {
	const db = await getDb();
	return new Promise<void>((resolve, reject) => {
		const tx = db.transaction(storeName, 'readwrite');
		const store = tx.objectStore(storeName);

		for (const file of files) {
			const request = store.put(file);
			request.onerror = () => {
				tx.abort();
				reject(
					new Error(
						`Error al guardar ${file.name}: ${request.error?.message}`,
					),
				);
			};
		}

		tx.oncomplete = () => {
			resolve();
		};

		tx.onerror = () => {
			reject(
				new Error(`Error en la transaccion: ${tx.error?.message}`),
			);
		};

		tx.onabort = () => {
			reject(
				new Error(`Transaccion cancelada: ${tx.error?.message}`),
			);
		};
	});
};

/**
 * Retrieves a single file including its binary data by name from the
 * given store.
 */
export const getFile = async (
	storeName: StoreName,
	name: string,
): Promise<GetResult<StoredFile>> => {
	try {
		const db = await getDb();
		return await new Promise<GetResult<StoredFile>>((resolve) => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const request = store.get(name);

			request.onsuccess = () => {
				const value = request.result as StoredFile | undefined;
				if (!value) {
					resolve({
						success: false,
						error: new Error(
							`Archivo "${name}" no encontrado`,
						),
					});
					return;
				}
				resolve({ success: true, value });
			};

			tx.onerror = () => {
				resolve({
					success: false,
					error: new Error(
						`Error al leer ${name}: ${tx.error?.message}`,
					),
				});
			};
		});
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error : new Error(String(error)),
		};
	}
};

/**
 * Returns all keys from the given store. Used by the graphics validator
 * to detect duplicate-extension conflicts against already-stored files.
 */
export const getAllKeys = async (
	storeName: StoreName,
): Promise<ReadonlyArray<string>> => {
	try {
		const db = await getDb();
		return await new Promise<ReadonlyArray<string>>((resolve) => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const request = store.getAllKeys();

			request.onsuccess = () => {
				resolve(request.result as ReadonlyArray<string>);
			};

			tx.onerror = () => {
				log.error(
					`getAllKeys(${storeName}): transaction error: ${tx.error?.message}`,
				);
				resolve([]);
			};
		});
	} catch (error) {
		log.error(
			`getAllKeys(${storeName}): ${error instanceof Error ? error.message : String(error)}`,
		);
		return [];
	}
};

/**
 * Returns all records from the given store. Used by Zustand store
 * hydration to load persisted data on app startup.
 */
export const getAll = async <T>(
	storeName: StoreName,
): Promise<ReadonlyArray<T>> => {
	try {
		const db = await getDb();
		return await new Promise<ReadonlyArray<T>>((resolve) => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const request = store.getAll();

			request.onsuccess = () => {
				resolve(request.result as ReadonlyArray<T>);
			};

			tx.onerror = () => {
				log.error(
					`getAll(${storeName}): transaction error: ${tx.error?.message}`,
				);
				resolve([]);
			};
		});
	} catch (error) {
		log.error(
			`getAll(${storeName}): ${error instanceof Error ? error.message : String(error)}`,
		);
		return [];
	}
};

/**
 * Removes all files from the given store, used when the user clears an
 * entire file type category.
 */
export const clearStore = async (
	storeName: StoreName,
): Promise<DeleteResult> => {
	try {
		const db = await getDb();
		return await new Promise<DeleteResult>((resolve) => {
			const tx = db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);
			store.clear();

			tx.oncomplete = () => {
				resolve({ success: true });
			};

			tx.onerror = () => {
				const err = new Error(
					`Failed to clear store: ${tx.error?.message}`,
				);
				log.error(
					`clearStore(${storeName}): transaction error: ${tx.error?.message}`,
				);
				resolve({ success: false, error: err });
			};
		});
	} catch (error) {
		log.error(
			`clearStore(${storeName}): ${error instanceof Error ? error.message : String(error)}`,
		);
		return {
			success: false,
			error:
				error instanceof Error ? error : new Error(String(error)),
		};
	}
};
