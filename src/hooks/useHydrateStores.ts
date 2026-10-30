import { DB_STORE_NAMES } from '@Constants/database';
import { getDatBasename } from '@Helpers/dats';
import { getIndiceBasename } from '@Helpers/indices';
import { getDatsActions } from '@Stores/datsStore';
import { getGraphicsActions } from '@Stores/graphicsStore';
import { getIndicesActions } from '@Stores/indicesStore';
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

			const indiceRecords = await getAll<{
				name: string;
				entries: ReadonlyArray<unknown>;
			}>(DB_STORE_NAMES.INDICES);
			getIndicesActions().setIndices(
				indiceRecords.map((r) => {
					return {
						name: getIndiceBasename(r.name),
						entries: r.entries,
					};
				}),
			);

			const datRecords = await getAll<{
				name: string;
				data: unknown;
			}>(DB_STORE_NAMES.DATS);
			getDatsActions().setDats(
				datRecords.map((r) => {
					return { name: getDatBasename(r.name), data: r.data };
				}),
			);
		};
		void hydrate();
	});
};
