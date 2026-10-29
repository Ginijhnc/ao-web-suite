import type { DB_STORE_NAMES } from '@Constants/database';
import type { ParsedDat } from '@Helpers/dats';
import type { ParsedIndice } from '@Helpers/indices';
import type { ValueOf } from '@Types/utility-types';

export type StoreName = ValueOf<typeof DB_STORE_NAMES>;

/**
 * Shared base for every IDB record. Each store uses `name` as its
 * keyPath, so every record type must carry it regardless of the
 * file-type-specific fields that follow.
 */
export type NamedRecord = {
	name: string;
	[key: string]: unknown;
};

export type FileMeta = {
	name: string;
	size: number;
	type: string;
};

export type StoredFile = FileMeta & {
	lastModified: number;
	data: ArrayBuffer;
};

export type MagicByteCheck = {
	extension: string;
	offset: number;
	bytes: ReadonlyArray<number>;
};

export type GetResult<T> =
	{ success: true; value: T } | { success: false; error: Error };

export type DeleteResult =
	{ success: true } | { success: false; error: Error };

export type ValidationResult =
	| {
			valid: true;
			/** File names already in IDB; avoids a second query on persist. */
			existingKeys?: ReadonlyArray<string>;
			/** Already-validated records; forwarded to skip re-parsing. */
			parsedIndices?: ReadonlyArray<ParsedIndice>;
			/** Already-validated dats; forwarded to skip re-parsing. */
			parsedDats?: ReadonlyArray<ParsedDat>;
	  }
	| { valid: false; message: string };

export type ValidationFn = (
	files: ReadonlyArray<File>,
) => Promise<ValidationResult>;
