import { useSyncExternalStore } from 'react';
import { DB_STORE_NAMES } from '@Constants/database';
import { getDatBasename, type ParsedDat } from '@Helpers/dats';
import { getIndiceBasename } from '@Helpers/indices';
import { getDatsActions } from '@Stores/datsStore';
import { getGraphicsActions } from '@Stores/graphicsStore';
import { getIndicesActions } from '@Stores/indicesStore';
import { useLogStore } from '@Stores/logStore';
import type { FileMeta, StoredFile } from '@Types/database';
import { getAll } from '@Utils/database';
import { onStoreMessage } from '@Utils/storeChannel';
import { useMountEffect } from './useMountEffect';

let hydrated = false;
const listeners = new Set<() => void>();

const markHydrated = (): void => {
	hydrated = true;
	listeners.forEach((l) => {
		l();
	});
};

const subscribe = (cb: () => void): (() => void) => {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
};

const getSnapshot = (): boolean => {
	return hydrated;
};

const hydrateGraphics = async (): Promise<void> => {
	const graphicsFiles = await getAll<StoredFile>(
		DB_STORE_NAMES.GRAPHICS,
	);
	const meta: Array<FileMeta> = graphicsFiles.map((f) => {
		return { name: f.name, size: f.size, type: f.type };
	});
	getGraphicsActions().setFiles(meta);
};

const hydrateIndices = async (): Promise<void> => {
	const indiceRecords = await getAll<{
		name: string;
		entries: ReadonlyArray<unknown>;
	}>(DB_STORE_NAMES.INDICES);
	getIndicesActions().setIndices(
		indiceRecords.map((r) => {
			return { name: getIndiceBasename(r.name), entries: r.entries };
		}),
	);
};

const hydrateDats = async (): Promise<void> => {
	const datRecords = await getAll<{ name: string; data: unknown }>(
		DB_STORE_NAMES.DATS,
	);
	getDatsActions().setDats(
		datRecords.map((r) => {
			return {
				name: getDatBasename(r.name),
				data: r.data,
			} as ParsedDat;
		}),
	);
};

type StoreMessage = Parameters<Parameters<typeof onStoreMessage>[0]>[0];

const handleGraphicsMessage = (msg: StoreMessage): void => {
	switch (msg.type) {
		case 'CLEARED':
			getGraphicsActions().clear();
			break;
		case 'UPDATED':
			void hydrateGraphics();
			break;
	}
};

const handleIndicesMessage = (msg: StoreMessage): void => {
	switch (msg.type) {
		case 'CLEARED':
			getIndicesActions().clear();
			break;
		case 'UPDATED':
			void hydrateIndices();
			break;
	}
};

const handleDatsMessage = (msg: StoreMessage): void => {
	switch (msg.type) {
		case 'CLEARED':
			getDatsActions().clear();
			break;
		case 'UPDATED':
			void hydrateDats();
			break;
	}
};

const handleStoreMessage = (msg: StoreMessage): void => {
	if (msg.type === 'LOG_ENTRIES_UPDATED') {
		useLogStore.setState({ entries: msg.entries });
		return;
	}
	if (msg.type === 'LOG_ENTRIES_CLEARED') {
		useLogStore.setState({ entries: [] });
		return;
	}
	if (msg.store === DB_STORE_NAMES.GRAPHICS) {
		handleGraphicsMessage(msg);
	}
	if (msg.store === DB_STORE_NAMES.INDICES) {
		handleIndicesMessage(msg);
	}
	if (msg.store === DB_STORE_NAMES.DATS) {
		handleDatsMessage(msg);
	}
};

/**
 * Reads all persisted files from IndexedDB on mount and hydrates the
 * in-memory Zustand stores with their metadata, so the UI reflects
 * any files saved in previous sessions without requiring a re-upload.
 */
export const useHydrateStores = (): void => {
	useMountEffect(() => {
		const hydrate = async () => {
			await hydrateGraphics();
			await hydrateIndices();
			await hydrateDats();
			markHydrated();
		};
		void hydrate();
	});

	useMountEffect(() => {
		return onStoreMessage(handleStoreMessage);
	});
};

/**
 * Returns true once useHydrateStores has finished reading from
 * IndexedDB and populating all Zustand stores.
 */
export const useHydrated = (): boolean => {
	return useSyncExternalStore(subscribe, getSnapshot);
};
