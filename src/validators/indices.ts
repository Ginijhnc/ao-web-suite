import {
	INDICES_ACCEPTED_EXTENSIONS,
	isValidIndiceName,
} from '@Constants/indices';
import { INDICES_MESSAGES } from '@Constants/messages';
import { parseIndiceFile } from '@Helpers/indices';
import type { ParsedIndice } from '@Helpers/indices';
import type { ValidationResult } from '@Types/database';
import {
	hasValidExtension,
	readFileAsText,
	truncateNameList,
} from '@Utils/file';
import { log } from '@Utils/logger';

/**
 * Verifies every file ends in .json. Returns the first offender so
 * the whole batch can be rejected with one toast.
 */
export const checkExtensions = (
	files: ReadonlyArray<File>,
): ValidationResult => {
	for (const file of files) {
		if (!hasValidExtension(file.name, INDICES_ACCEPTED_EXTENSIONS)) {
			return {
				valid: false,
				message: INDICES_MESSAGES.INVALID_EXTENSION(file.name),
			};
		}
	}

	return { valid: true };
};

/**
 * Aggregates every unrecognized basename in the selection and rejects
 * with a truncated list so a user picking many wrong files sees them
 * all (up to FILE_LIST_TRUNCATE_AT) instead of one at a time.
 */
export const checkRecognizedNames = (
	files: ReadonlyArray<File>,
): ValidationResult => {
	const unknown = files
		.filter((f) => {
			return !isValidIndiceName(f.name);
		})
		.map((f) => {
			return f.name;
		});

	const [first] = unknown;

	if (!first) {
		return { valid: true };
	}

	return {
		valid: false,
		message: INDICES_MESSAGES.UNKNOWN_INDICE(
			truncateNameList(unknown),
		),
	};
};

type OneFileResult =
	| { valid: true; indice: ParsedIndice }
	| { valid: false; message: string };

/**
 * Reads one file as text, rejects if empty (zero bytes or
 * whitespace-only), then runs JSON.parse + zero-strip + schema check
 * via parseIndiceFile. The full schema detail goes to log.error; the
 * toast stays short.
 */
const validateOneFile = async (file: File): Promise<OneFileResult> => {
	if (file.size === 0) {
		return {
			valid: false,
			message: INDICES_MESSAGES.EMPTY_FILE(file.name),
		};
	}

	const text = await readFileAsText(file);
	if (text.trim().length === 0) {
		return {
			valid: false,
			message: INDICES_MESSAGES.EMPTY_FILE(file.name),
		};
	}

	const parsed = parseIndiceFile(file.name, text);
	if (parsed.success) {
		return { valid: true, indice: parsed.parsed };
	}

	log.error(`${file.name}: ${parsed.detail}`);
	const message =
		parsed.reason === 'invalid-json'
			? INDICES_MESSAGES.INVALID_JSON(file.name)
			: INDICES_MESSAGES.SCHEMA_MISMATCH(file.name);

	return {
		valid: false,
		message,
	};
};

/**
 * Validates files one at a time in order, stopping at the first
 * failure. Implemented as recursion instead of a for-await loop to
 * satisfy the no-await-in-loop lint rule.
 */
const validateFilesSequentially = (
	files: ReadonlyArray<File>,
	index: number,
	accumulated: Array<ParsedIndice>,
): Promise<ValidationResult> => {
	const file = files[index];

	if (!file) {
		return Promise.resolve({
			valid: true,
			parsedIndices: accumulated,
		});
	}

	return validateOneFile(file).then((result) => {
		if (!result.valid) {
			return result;
		}
		accumulated.push(result.indice);
		return validateFilesSequentially(files, index + 1, accumulated);
	});
};

/**
 * Orchestrator: extension check, recognized-name check, then per-file
 * empty/JSON/schema validation. Rejects the whole selection on the
 * first failing step.
 */
export const validateIndicesFiles = (
	files: ReadonlyArray<File>,
): Promise<ValidationResult> => {
	const ext = checkExtensions(files);
	if (!ext.valid) {
		return Promise.resolve(ext);
	}

	const known = checkRecognizedNames(files);
	if (!known.valid) {
		return Promise.resolve(known);
	}

	return validateFilesSequentially(files, 0, []);
};
