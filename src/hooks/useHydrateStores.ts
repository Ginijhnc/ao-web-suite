import { DB_STORE_NAMES } from '@Constants/database';
import { getGraphicsActions } from '@Stores/graphicsStore';
import type { FileMeta, StoredFile } from '@Types/database';
import { getAll } from '@Utils/database';
import { useMountEffect } from './useMountEffect';

/**
 * Reads all persisted files from IndexedDB on mount and hydrates the
 * in-memory Zustand stores with their metadata, so the UI reflects
 * any files saved in previous sessions without requiring a re-upload.
 */
export const useHydrateStores = (): void => {
	useMountEffect(() => {
		const hydrate = async () => {
			const graphicsFiles = await getAll<StoredFile>(
				DB_STORE_NAMES.GRAPHICS,
			);
			const meta: Array<FileMeta> = graphicsFiles.map((f) => {
				return { name: f.name, size: f.size, type: f.type };
			});
			getGraphicsActions().setFiles(meta);
		};
		void hydrate();
	});
};
