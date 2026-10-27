import { useRef, useState } from 'react';
import type { FileType } from '@Constants/database';
import {
	DB_BATCH_SIZE,
	DB_STORE_NAMES,
	FILE_TYPES,
	FILE_LIST_TRUNCATE_AT,
} from '@Constants/database';
import { DATS_ACCEPTED_EXTENSIONS } from '@Constants/dats';
import { GRAPHICS_ACCEPTED_EXTENSIONS } from '@Constants/graphics';
import { INDICES_ACCEPTED_EXTENSIONS } from '@Constants/indices';
import { GRAPHICS_MESSAGES } from '@Constants/messages';
import { getGraphicsActions } from '@Stores/graphicsStore';
import type {
	FileMeta,
	StoreName,
	StoredFile,
	ValidationResult,
} from '@Types/database';
import type { FileTypeConfig } from '@Types/fileUploader';
import { clearStore, putFiles } from '@Utils/database';
import { log } from '@Utils/logger';
import { Toast } from '@Utils/toast';
import { validateGraphicsFiles } from '@Validators/graphics';

type UploadState = {
	isUploading: boolean;
};

const graphicsConfig: FileTypeConfig = {
	accept: GRAPHICS_ACCEPTED_EXTENSIONS,
	store: DB_STORE_NAMES.GRAPHICS,
	validate: validateGraphicsFiles,
	postProcess: (files) => {
		const meta: Array<FileMeta> = files.map((f) => {
			return { name: f.name, size: f.size, type: f.type };
		});
		getGraphicsActions().addFiles(meta);
	},
	onClear: () => {
		getGraphicsActions().clear();
	},
};

const indicesConfig: FileTypeConfig = {
	accept: INDICES_ACCEPTED_EXTENSIONS,
	store: DB_STORE_NAMES.INDICES,
	validate: () => {
		return Promise.resolve({ valid: true });
	},
	postProcess: () => {},
	onClear: () => {},
};

const datsConfig: FileTypeConfig = {
	accept: DATS_ACCEPTED_EXTENSIONS,
	store: DB_STORE_NAMES.DATS,
	validate: () => {
		return Promise.resolve({ valid: true });
	},
	postProcess: () => {},
	onClear: () => {},
};

const FILE_TYPE_CONFIG: Record<FileType, FileTypeConfig> = {
	[FILE_TYPES.GRAPHICS]: graphicsConfig,
	[FILE_TYPES.INDICES]: indicesConfig,
	[FILE_TYPES.DATS]: datsConfig,
};

/**
 * Converts a raw File into a StoredFile by reading its binary contents.
 * Needed because IndexedDB stores ArrayBuffers, not File objects directly.
 */
const readFileAsStoredFile = (file: File): Promise<StoredFile> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const data = reader.result;
			if (!(data instanceof ArrayBuffer)) {
				reject(new Error(`Error al leer ${file.name}`));
				return;
			}
			resolve({
				name: file.name,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
				data,
			});
		};
		reader.onerror = () => {
			reject(new Error(`Error al leer ${file.name}`));
		};
		reader.readAsArrayBuffer(file);
	});
};

/**
 * Writes one slice of the file array to IDB within a single transaction.
 * Batching prevents holding one massive transaction open for the full upload.
 */
const processBatch = async (
	batch: ReadonlyArray<File>,
	storeName: StoreName,
): Promise<void> => {
	const storedFiles = await Promise.all(batch.map(readFileAsStoredFile));
	await putFiles(storeName, storedFiles);
};

/**
 * Chains batches sequentially so IDB is never overwhelmed by parallel
 * transactions, which can cause quota errors on large uploads.
 */
const processFiles = (
	fileArray: ReadonlyArray<File>,
	storeName: StoreName,
): Promise<void> => {
	const batches: Array<ReadonlyArray<File>> = [];
	for (let i = 0; i < fileArray.length; i += DB_BATCH_SIZE) {
		batches.push(fileArray.slice(i, i + DB_BATCH_SIZE));
	}

	return batches.reduce<Promise<void>>((chain, batch) => {
		return chain.then(() => {
			return processBatch(batch, storeName);
		});
	}, Promise.resolve());
};

/**
 * Runs the validator for the given file type and shows an error toast
 * on failure. Returns true when files are valid.
 */
const runValidation = async (
	fileType: FileType,
	files: ReadonlyArray<File>,
): Promise<ValidationResult> => {
	const result = await FILE_TYPE_CONFIG[fileType].validate(files);
	if (!result.valid) {
		log.error(result.message);
		Toast.error(result.message);
	}
	return result;
};

/**
 * Persists the validated batch and runs the file type's post-process
 * step, then surfaces a success toast.
 */
const persistAndNotify = async (
	fileType: FileType,
	files: ReadonlyArray<File>,
	existingKeys: ReadonlyArray<string>,
): Promise<void> => {
	const config = FILE_TYPE_CONFIG[fileType];
	try {
		await processFiles(files, config.store);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : String(error);
		log.error(message);
		Toast.error(
			'Error al guardar los archivos. No se guardó ningún archivo.',
		);
		return;
	}
	config.postProcess(files);

	const existingSet = new Set(
		existingKeys.map((k) => {
			return k.toLowerCase();
		}),
	);
	const replaced = files.filter((f) => {
		return existingSet.has(f.name.toLowerCase());
	});

	if (replaced.length === 0) {
		Toast.success(GRAPHICS_MESSAGES.UPLOAD_SUCCESS);
		return;
	}

	const listed = replaced
		.slice(0, FILE_LIST_TRUNCATE_AT)
		.map((f) => {
			return f.name;
		})
		.join(', ');
	const overflow =
		replaced.length > FILE_LIST_TRUNCATE_AT
			? ` y ${replaced.length - FILE_LIST_TRUNCATE_AT} más`
			: '';
	Toast.success(
		GRAPHICS_MESSAGES.UPLOAD_REPLACED(`${listed}${overflow}`),
	);
};

export const useFileUploader = () => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [uploadState, setUploadState] = useState<UploadState>({
		isUploading: false,
	});

	/**
	 * Returns an async handler for the file input's change event, closed over
	 * the current fileType config so each picker invocation gets its own handler.
	 */
	const createFileChangeHandler = (
		fileType: FileType,
	): (() => Promise<void>) => {
		return async (): Promise<void> => {
			const currentInput = inputRef.current;
			if (!currentInput?.files || currentInput.files.length === 0) {
				return;
			}

			const fileArray = Array.from(currentInput.files);
			const result = await runValidation(fileType, fileArray);
			if (!result.valid) {
				currentInput.value = '';
				return;
			}

			setUploadState({ isUploading: true });
			await persistAndNotify(
				fileType,
				fileArray,
				result.existingKeys ?? [],
			);
			setUploadState({ isUploading: false });
			currentInput.value = '';
		};
	};

	/**
	 * Opens a native file picker scoped to the given FileType, then processes
	 * and persists the selected files to the corresponding IDB store.
	 */
	const openFilePicker = (fileType: FileType): void => {
		if (uploadState.isUploading) {
			return;
		}

		let input = inputRef.current;
		if (!input) {
			input = document.createElement('input');
			input.type = 'file';
			input.multiple = true;
			input.style.display = 'none';
			document.body.appendChild(input);
			inputRef.current = input;
		}

		input.accept = FILE_TYPE_CONFIG[fileType].accept;
		input.onchange = createFileChangeHandler(fileType);

		input.click();
	};

	const clearFiles = async (fileType: FileType) => {
		const config = FILE_TYPE_CONFIG[fileType];
		const result = await clearStore(config.store);
		if (result.success) {
			config.onClear();
			Toast.success(GRAPHICS_MESSAGES.CLEAR_SUCCESS(fileType));
		} else {
			const message = `Error al limpiar ${fileType}: ${result.error.message}`;
			log.error(message);
			Toast.error(message);
		}
		return result;
	};

	return {
		openFilePicker,
		clearFiles,
		uploadState,
	};
};
