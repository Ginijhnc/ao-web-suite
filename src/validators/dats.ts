import { DB_STORE_NAMES } from '@Constants/database';
import {
	DAT_HEADER_KEYS,
	DAT_SECTION_PREFIXES,
	DATS_ACCEPTED_EXTENSIONS,
	isValidDatName,
} from '@Constants/dats';
import { DATS_MESSAGES } from '@Constants/messages';
import { getDatBasename, parseDatFile } from '@Helpers/dats';
import type { DatParseFailureReason, ParsedDat } from '@Helpers/dats';
import type { ValidationResult } from '@Types/database';
import { getAllKeys } from '@Utils/database';
import {
	hasValidExtension,
	readFileAsText,
	truncateNameList,
} from '@Utils/file';
import { log } from '@Utils/logger';

export const checkExtensions = (
	files: ReadonlyArray<File>,
): ValidationResult => {
	for (const file of files) {
		if (!hasValidExtension(file.name, DATS_ACCEPTED_EXTENSIONS)) {
			return {
				valid: false,
				message: DATS_MESSAGES.INVALID_EXTENSION(file.name),
			};
		}
	}
	return { valid: true };
};

export const checkRecognizedNames = (
	files: ReadonlyArray<File>,
): ValidationResult => {
	const unknown = files
		.filter((f) => {
			return !isValidDatName(f.name);
		})
		.map((f) => {
			return f.name;
		});

	const [first] = unknown;
	if (!first) return { valid: true };

	return {
		valid: false,
		message: DATS_MESSAGES.UNKNOWN_DAT(truncateNameList(unknown)),
	};
};

const buildParseErrorMessage = (
	fileName: string,
	reason: DatParseFailureReason,
	detail: string,
): string => {
	const name = getDatBasename(fileName);
	if (reason === 'missing-header') {
		return DATS_MESSAGES.MISSING_HEADER(
			fileName,
			DAT_HEADER_KEYS[name],
		);
	}
	if (reason === 'no-entries') {
		return DATS_MESSAGES.NO_ENTRIES(
			fileName,
			DAT_SECTION_PREFIXES[name],
		);
	}
	if (reason === 'duplicate-ids') {
		return DATS_MESSAGES.DUPLICATE_IDS(fileName, detail);
	}
	if (reason === 'duplicate-fields') {
		return DATS_MESSAGES.DUPLICATE_FIELDS(fileName, detail);
	}
	return DATS_MESSAGES.SCHEMA_MISMATCH(fileName);
};

type OneFileResult =
	{ valid: true; dat: ParsedDat } | { valid: false; message: string };

const validateOneFile = async (file: File): Promise<OneFileResult> => {
	if (file.size === 0) {
		return {
			valid: false,
			message: DATS_MESSAGES.EMPTY_FILE(file.name),
		};
	}

	const text = await readFileAsText(file);
	if (text.trim().length === 0) {
		return {
			valid: false,
			message: DATS_MESSAGES.EMPTY_FILE(file.name),
		};
	}

	const parsed = parseDatFile(file.name, text);
	if (parsed.success) return { valid: true, dat: parsed.parsed };

	log.error(`${file.name}: ${parsed.detail}`);
	const message = buildParseErrorMessage(
		file.name,
		parsed.reason,
		parsed.detail,
	);
	return { valid: false, message };
};

const validateFilesSequentially = (
	files: ReadonlyArray<File>,
	index: number,
	accumulated: Array<ParsedDat>,
): Promise<ValidationResult> => {
	const file = files[index];
	if (!file) {
		return Promise.resolve({ valid: true, parsedDats: accumulated });
	}
	return validateOneFile(file).then((result) => {
		if (!result.valid) return result;
		accumulated.push(result.dat);
		return validateFilesSequentially(files, index + 1, accumulated);
	});
};

export const validateDatsFiles = async (
	files: ReadonlyArray<File>,
): Promise<ValidationResult> => {
	const ext = checkExtensions(files);
	if (!ext.valid) return ext;

	const known = checkRecognizedNames(files);
	if (!known.valid) return known;

	const result = await validateFilesSequentially(files, 0, []);
	if (!result.valid) return result;

	const existingKeys = await getAllKeys(DB_STORE_NAMES.DATS);
	return {
		valid: true,
		parsedDats: result.parsedDats,
		existingKeys,
	};
};
