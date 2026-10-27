import { DB_STORE_NAMES } from '@Constants/database';
import {
	GRAPHICS_ACCEPTED_EXTENSIONS,
	GRAPHICS_MAGIC_BYTES,
	GRAPHICS_MAGIC_BYTE_HEADER_SIZE,
} from '@Constants/graphics';
import { GRAPHICS_MESSAGES } from '@Constants/messages';
import type { ValidationResult } from '@Types/database';
import { getAllKeys } from '@Utils/database';
import { hasValidExtension, truncateNameList } from '@Utils/file';
import { log } from '@Utils/logger';

/**
 * Reads only the first few bytes of a file to avoid loading the full
 * contents into memory just for format validation.
 */
const readFileHeader = (file: File): Promise<Uint8Array> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const data = reader.result;
			if (!(data instanceof ArrayBuffer)) {
				const message = `Error al leer encabezado de ${file.name}`;
				log.error(
					`readFileHeader(${file.name}): result was not an ArrayBuffer`,
				);
				reject(new Error(message));
				return;
			}
			resolve(new Uint8Array(data));
		};
		reader.onerror = () => {
			const message = `Error al leer encabezado de ${file.name}`;
			log.error(
				`readFileHeader(${file.name}): ${reader.error?.message}`,
			);
			reject(new Error(message));
		};
		reader.readAsArrayBuffer(
			file.slice(0, GRAPHICS_MAGIC_BYTE_HEADER_SIZE),
		);
	});
};

/**
 * Confirms the file's binary header matches the magic bytes for its
 * declared extension, catching corrupted files or accidental mismatches
 * between the file contents and its extension.
 */
export const hasValidMagicBytes = async (file: File): Promise<boolean> => {
	const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
	const check = GRAPHICS_MAGIC_BYTES.find(({ extension }) => {
		return extension === ext;
	});
	if (!check) {
		return false;
	}
	const header = await readFileHeader(file);
	return check.bytes.every((byte, i) => {
		return header[check.offset + i] === byte;
	});
};

/**
 * Extracts the basename (filename without extension) from a file name.
 */
const getBasename = (fileName: string): string => {
	const dotIndex = fileName.lastIndexOf('.');
	if (dotIndex === -1) {
		return fileName;
	}
	return fileName.slice(0, dotIndex);
};

/**
 * Detects same-basename-different-extension conflicts within the upload
 * batch itself (e.g. 4006.png and 4006.bmp selected together).
 */
const checkBatchConflicts = (
	files: ReadonlyArray<File>,
): ValidationResult => {
	const batchByBasename = new Map<string, string>();
	const conflicts: Array<string> = [];

	for (const file of files) {
		const basename = getBasename(file.name).toLowerCase();
		const existing = batchByBasename.get(basename);
		if (existing && existing !== file.name.toLowerCase()) {
			conflicts.push(file.name);
		} else {
			batchByBasename.set(basename, file.name.toLowerCase());
		}
	}

	const [firstConflict] = conflicts;
	if (!firstConflict) {
		return { valid: true };
	}

	return {
		valid: false,
		message: GRAPHICS_MESSAGES.CONFLICT_BATCH(
			truncateNameList(conflicts),
		),
	};
};

/**
 * Detects same-basename-different-extension conflicts between the upload
 * batch and files already stored in IDB. Same-name replacements are
 * allowed and not flagged as conflicts.
 */
const checkExistingConflicts = (
	files: ReadonlyArray<File>,
	existingKeys: ReadonlyArray<string>,
): ValidationResult => {
	const existingByBasename = new Map<string, string>();
	for (const key of existingKeys) {
		const basename = getBasename(key).toLowerCase();
		existingByBasename.set(basename, key.toLowerCase());
	}

	const conflicts: Array<string> = [];

	for (const file of files) {
		const basename = getBasename(file.name).toLowerCase();
		const existingKey = existingByBasename.get(basename);
		if (existingKey && existingKey !== file.name.toLowerCase()) {
			conflicts.push(file.name);
		}
	}

	const [firstConflict] = conflicts;
	if (!firstConflict) {
		return { valid: true };
	}

	return {
		valid: false,
		message: GRAPHICS_MESSAGES.CONFLICT_EXISTING(
			truncateNameList(conflicts),
		),
	};
};

/**
 * Detects same-basename-different-extension conflicts both within the
 * upload batch and against existing IDB keys.
 *
 * Cases handled:
 * - Batch contains 4006.png AND 4006.bmp -> reject
 * - IDB has 4006.png, batch contains 4006.bmp -> reject
 * - IDB has 4006.png, batch contains 4006.png -> allow (replacement)
 */
export const checkDuplicateExtensions = (
	files: ReadonlyArray<File>,
	existingKeys: ReadonlyArray<string>,
): ValidationResult => {
	const batchResult = checkBatchConflicts(files);
	if (!batchResult.valid) {
		return batchResult;
	}
	return checkExistingConflicts(files, existingKeys);
};

/**
 * Orchestrates extension check, magic bytes, and duplicate-extension
 * check for graphics files. Rejects the entire batch on first failure.
 */
export const validateGraphicsFiles = async (
	files: ReadonlyArray<File>,
): Promise<ValidationResult> => {
	for (const file of files) {
		if (!hasValidExtension(file.name, GRAPHICS_ACCEPTED_EXTENSIONS)) {
			return {
				valid: false,
				message: GRAPHICS_MESSAGES.INVALID_EXTENSION(
					file.name,
					GRAPHICS_ACCEPTED_EXTENSIONS,
				),
			};
		}
	}

	const magicByteResults = await Promise.all(
		files.map(async (file) => {
			const valid = await hasValidMagicBytes(file);
			return { valid, file };
		}),
	);
	const invalidMagicByte = magicByteResults.find((r) => {
		return !r.valid;
	});
	if (invalidMagicByte) {
		return {
			valid: false,
			message: GRAPHICS_MESSAGES.INVALID_MAGIC_BYTES(
				invalidMagicByte.file.name,
			),
		};
	}

	const existingKeys = await getAllKeys(DB_STORE_NAMES.GRAPHICS);
	const conflictResult = checkDuplicateExtensions(files, existingKeys);
	if (!conflictResult.valid) {
		return conflictResult;
	}
	return { valid: true, existingKeys };
};
