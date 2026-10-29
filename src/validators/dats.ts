import { DB_STORE_NAMES } from '@Constants/database';
import {
	DAT_HEADER_KEYS,
	DAT_SECTION_PREFIXES,
	DATS_ACCEPTED_EXTENSIONS,
	isValidDatName,
} from '@Constants/dats';
import { DATS_MESSAGES } from '@Constants/messages';
import { getDatBasename, parseDatFile } from '@Helpers/dats';
import type { ParsedDat } from '@Helpers/dats';
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
	const name = getDatBasename(file.name);
	const message =
		parsed.reason === 'missing-header'
			? DATS_MESSAGES.MISSING_HEADER(
					file.name,
					DAT_HEADER_KEYS[name],
				)
			: parsed.reason === 'no-entries'
				? DATS_MESSAGES.NO_ENTRIES(
						file.name,
						DAT_SECTION_PREFIXES[name],
					)
				: DATS_MESSAGES.SCHEMA_MISMATCH(file.name);
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
