import type { DB_STORE_NAMES } from '@Constants/database';
import type { ValueOf } from '@Types/utility-types';

export type StoreName = ValueOf<typeof DB_STORE_NAMES>;

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
	// existingKeys: file names already in IDB, passed back to avoid a second query
	| { valid: true; existingKeys?: ReadonlyArray<string> }
	| { valid: false; invalidFileName: string; message: string };

export type ValidationFn = (
	files: ReadonlyArray<File>,
) => Promise<ValidationResult>;
