import { useRef, useState } from 'react';
import type { FileType } from '@Constants/database';
import {
	DB_BATCH_SIZE,
	DB_STORE_NAMES,
	FILE_TYPES,
} from '@Constants/database';
import { DATS_ACCEPTED_EXTENSIONS } from '@Constants/dats';
import { GRAPHICS_ACCEPTED_EXTENSIONS } from '@Constants/graphics';
import { INDICES_ACCEPTED_EXTENSIONS } from '@Constants/indices';
import {
	CLEAR_SUCCESS,
	GRAPHICS_MESSAGES,
	INDICES_MESSAGES,
} from '@Constants/messages';
import type { ParsedIndice } from '@Helpers/indices';
import { getGraphicsActions } from '@Stores/graphicsStore';
import type {
	FileMeta,
	StoreName,
	StoredFile,
	ValidationResult,
} from '@Types/database';
import type { FileTypeConfig } from '@Types/fileUploader';
import { clearStore, putFiles } from '@Utils/database';
import { truncateNameList } from '@Utils/file';
import { log } from '@Utils/logger';
import { Toast } from '@Utils/toast';
import { validateGraphicsFiles } from '@Validators/graphics';
import { validateIndicesFiles } from '@Validators/indices';

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
	successMessages: {
		uploadSuccess: GRAPHICS_MESSAGES.UPLOAD_SUCCESS,
		uploadReplaced: GRAPHICS_MESSAGES.UPLOAD_REPLACED,
	},
};

const indicesConfig: FileTypeConfig = {
	accept: INDICES_ACCEPTED_EXTENSIONS,
	store: DB_STORE_NAMES.INDICES,
	validate: validateIndicesFiles,
	postProcess: () => {},
	onClear: () => {},
	successMessages: {
		uploadSuccess: INDICES_MESSAGES.UPLOAD_SUCCESS,
		uploadReplaced: INDICES_MESSAGES.UPLOAD_REPLACED,
	},
	buildRecordsFromValidation: (parsedIndices) => {
		const uploadedAt = Date.now();
		return parsedIndices.map((indice) => {
			return {
				name: indice.name,
				entries: indice.entries,
				uploadedAt,
			};
		});
	},
};

const datsConfig: FileTypeConfig = {
	accept: DATS_ACCEPTED_EXTENSIONS,
	store: DB_STORE_NAMES.DATS,
	validate: () => {
		return Promise.resolve({ valid: true });
	},
	postProcess: () => {},
	onClear: () => {},
	successMessages: {
		uploadSuccess: 'Todos los archivos fueron subidos correctamente.',
		uploadReplaced: (names: string) => {
			return `Los archivos ${names} fueron reemplazados correctamente.`;
		},
	},
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
 * Writes one slice of the file array to IDB within a single
 * transaction. Batching prevents holding one massive transaction open
 * for the full upload.
 */
const processBatch = async (
	batch: ReadonlyArray<File>,
	storeName: StoreName,
): Promise<void> => {
	const records = await Promise.all(batch.map(readFileAsStoredFile));
	await putFiles(storeName, records);
};

/**
 * Processes each batch in sequence, waiting for one IDB transaction
 * to complete before starting the next. Terminates when all batches
 * have been written.
 */
const runBatchesSequentially = (
	batches: ReadonlyArray<ReadonlyArray<File>>,
	config: FileTypeConfig,
	index: number,
): Promise<void> => {
	const batch = batches[index];
	if (!batch) {
		return Promise.resolve();
	}
	return processBatch(batch, config.store).then(() => {
		return runBatchesSequentially(batches, config, index + 1);
	});
};

/**
 * Splits the file array into DB_BATCH_SIZE slices and runs them
 * sequentially to avoid overwhelming IDB with parallel transactions.
 */
const processFiles = (
	fileArray: ReadonlyArray<File>,
	config: FileTypeConfig,
): Promise<void> => {
	const batches: Array<ReadonlyArray<File>> = [];
	for (let i = 0; i < fileArray.length; i += DB_BATCH_SIZE) {
		batches.push(fileArray.slice(i, i + DB_BATCH_SIZE));
	}
	return runBatchesSequentially(batches, config, 0);
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
 * Returns a truncated, comma-joined list of file names that overwrite
 * an existing IDB record, or null when no replacements occurred. Used
 * by persistAndNotify to pick between the success and replaced toasts.
 */
const formatReplacedList = (
	files: ReadonlyArray<File>,
	existingKeys: ReadonlyArray<string>,
	truncateAt: number,
): string | null => {
	const existingSet = new Set(
		existingKeys.map((k) => {
			return k.toLowerCase();
		}),
	);
	const replaced = files.filter((f) => {
		return existingSet.has(f.name.toLowerCase());
	});
	if (replaced.length === 0) {
		return null;
	}
	return truncateNameList(
		replaced.map((f) => {
			return f.name;
		}),
		truncateAt,
	);
};

/**
 * Separated from the file-input change handler so the handler only
 * owns the input lifecycle (reading files, resetting the value) and
 * not the validate-persist-notify flow.
 */
const runUpload = async (
	fileType: FileType,
	fileArray: Array<File>,
	setUploadState: (state: UploadState) => void,
): Promise<void> => {
	const result = await runValidation(fileType, fileArray);
	if (!result.valid) {
		return;
	}

	setUploadState({ isUploading: true });

	await persistAndNotify(
		fileType,
		fileArray,
		result.existingKeys ?? [],
		result.parsedIndices ?? [],
	);

	setUploadState({ isUploading: false });
};

/**
 * Persists the validated batch and runs the file type's post-process
 * step, then surfaces a success toast.
 */
const persistAndNotify = async (
	fileType: FileType,
	files: ReadonlyArray<File>,
	existingKeys: ReadonlyArray<string>,
	parsedIndices: ReadonlyArray<ParsedIndice>,
): Promise<void> => {
	const config = FILE_TYPE_CONFIG[fileType];
	try {
		if (config.buildRecordsFromValidation) {
			const records =
				config.buildRecordsFromValidation(parsedIndices);
			await putFiles(config.store, records);
		} else {
			await processFiles(files, config);
		}
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

	const replacedList = formatReplacedList(files, existingKeys, 3);
	if (!replacedList) {
		Toast.success(config.successMessages.uploadSuccess);
		return;
	}
	Toast.success(config.successMessages.uploadReplaced(replacedList));
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
			await runUpload(fileType, fileArray, setUploadState);
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
			Toast.success(CLEAR_SUCCESS(fileType));
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
