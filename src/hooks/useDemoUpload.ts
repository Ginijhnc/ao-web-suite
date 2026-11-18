import { useRef, useState } from 'react';
import { DB_BATCH_SIZE, DB_STORE_NAMES } from '@Constants/database';
import { DEMO_GRAPHIC_FILENAMES } from '@Constants/graphics';
import { INDICES_NAMES } from '@Constants/indices';
import {
	DATS_MESSAGES,
	DEMO_UPLOAD_CANCELLED,
	DEMO_UPLOAD_ERROR,
	GRAPHICS_MESSAGES,
	INDICES_MESSAGES,
} from '@Constants/messages';
import { getDatsActions } from '@Stores/datsStore';
import { getGraphicsActions } from '@Stores/graphicsStore';
import { getIndicesActions } from '@Stores/indicesStore';
import type { FileMeta, StoredFile } from '@Types/database';
import { putFiles } from '@Utils/database';
import { log } from '@Utils/logger';
import { Toast } from '@Utils/toast';
import { validateDatsFiles } from '@Validators/dats';
import { validateGraphicsFiles } from '@Validators/graphics';
import { validateIndicesFiles } from '@Validators/indices';
import { useMountEffect } from './useMountEffect';

const INDICES_TO_UPLOAD: ReadonlyArray<string> = Object.values(
	INDICES_NAMES,
).map((name) => {
	return `${name}.json`;
});

/* Unlike indices, DAT_NAMES are lowercase but the on-disk filenames 
   are mixed-case, and fetch() URLs are case-sensitive. */
const DATS_TO_UPLOAD: ReadonlyArray<string> = [
	'NPCs.dat',
	'Obj.dat',
	'Hechizos.dat',
];

const fetchAsFile = async (
	path: string,
	filename: string,
	signal: AbortSignal,
): Promise<File> => {
	const res = await fetch(path, { signal });
	if (!res.ok) {
		throw new Error(
			`Error al cargar ${filename}: ${res.status.toString()} ${res.statusText}`,
		);
	}
	const blob = await res.blob();
	return new File([blob], filename, { type: blob.type });
};

const readAsStoredFile = async (file: File): Promise<StoredFile> => {
	const data = await file.arrayBuffer();
	return {
		name: file.name,
		size: file.size,
		type: file.type,
		lastModified: file.lastModified,
		data,
	};
};

const persistBatchSequentially = (
	batches: ReadonlyArray<ReadonlyArray<File>>,
	index: number,
): Promise<void> => {
	const batch = batches[index];
	if (!batch) {
		return Promise.resolve();
	}
	return Promise.all(batch.map(readAsStoredFile))
		.then((records) => {
			return putFiles(DB_STORE_NAMES.GRAPHICS, records);
		})
		.then(() => {
			return persistBatchSequentially(batches, index + 1);
		});
};

const persistGraphics = (files: ReadonlyArray<File>): Promise<void> => {
	const batches: Array<ReadonlyArray<File>> = [];
	for (let i = 0; i < files.length; i += DB_BATCH_SIZE) {
		batches.push(files.slice(i, i + DB_BATCH_SIZE));
	}
	return persistBatchSequentially(batches, 0);
};

const uploadGraphics = async (
	files: ReadonlyArray<File>,
): Promise<void> => {
	const result = await validateGraphicsFiles(files);
	if (!result.valid) {
		log.error(result.message);
		Toast.error(result.message);
		return;
	}
	await persistGraphics(files);
	const meta: Array<FileMeta> = files.map((f) => {
		return { name: f.name, size: f.size, type: f.type };
	});
	getGraphicsActions().addFiles(meta);
	Toast.success(GRAPHICS_MESSAGES.UPLOAD_SUCCESS);
};

const uploadIndices = async (
	files: ReadonlyArray<File>,
): Promise<void> => {
	const result = await validateIndicesFiles(files);
	if (!result.valid) {
		log.error(result.message);
		Toast.error(result.message);
		return;
	}
	const uploadedAt = Date.now();
	const records = (result.parsedIndices ?? []).map((indice) => {
		return {
			name: `${indice.name}.json`,
			entries: indice.entries,
			uploadedAt,
		};
	});
	await putFiles(DB_STORE_NAMES.INDICES, records);
	getIndicesActions().upsertIndices(result.parsedIndices ?? []);
	Toast.success(INDICES_MESSAGES.UPLOAD_SUCCESS);
};

const uploadDats = async (files: ReadonlyArray<File>): Promise<void> => {
	const result = await validateDatsFiles(files);
	if (!result.valid) {
		log.error(result.message);
		Toast.error(result.message);
		return;
	}
	const uploadedAt = Date.now();
	const records = (result.parsedDats ?? []).map((dat) => {
		return { name: `${dat.name}.dat`, data: dat.data, uploadedAt };
	});
	await putFiles(DB_STORE_NAMES.DATS, records);
	getDatsActions().upsertDats(result.parsedDats ?? []);
	Toast.success(DATS_MESSAGES.UPLOAD_SUCCESS);
};

export const useDemoUpload = () => {
	const [isLoading, setIsLoading] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const uploadCompletedRef = useRef(false);

	useMountEffect(() => {
		return () => {
			if (
				!uploadCompletedRef.current &&
				abortControllerRef.current?.signal.aborted === false
			) {
				log.warn(
					'Demo FAB upload cancelled: user navigated away before completion.',
				);
			}
			abortControllerRef.current?.abort();
		};
	});

	const start = async (): Promise<void> => {
		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;
		setIsLoading(true);
		try {
			const graphicFiles = await Promise.all(
				DEMO_GRAPHIC_FILENAMES.map((name) => {
					return fetchAsFile(
						`/game_assets/graphics/${name}`,
						name,
						signal,
					);
				}),
			);
			await uploadGraphics(graphicFiles);

			const indiceFiles = await Promise.all(
				INDICES_TO_UPLOAD.map((name) => {
					return fetchAsFile(
						`/game_assets/indices/${name}`,
						name,
						signal,
					);
				}),
			);
			await uploadIndices(indiceFiles);

			const datFiles = await Promise.all(
				DATS_TO_UPLOAD.map((name) => {
					return fetchAsFile(
						`/game_assets/dats/${name}`,
						name,
						signal,
					);
				}),
			);
			await uploadDats(datFiles);

			uploadCompletedRef.current = true;
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				Toast.warning(DEMO_UPLOAD_CANCELLED);
				return;
			}
			const message =
				error instanceof Error ? error.message : String(error);
			log.error(message);
			Toast.error(DEMO_UPLOAD_ERROR);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, start };
};
