import type { IndiceName } from '@Constants/indices';
import { INDICE_SCHEMAS } from '@Types/indices';

/**
 * Extracts the lowercase basename (filename without extension) so it
 * can be matched against the IndiceName union. Used before every schema
 * lookup and IDB write so casing in the file name never matters.
 */
export const getIndiceBasename = (fileName: string): IndiceName => {
	const dot = fileName.lastIndexOf('.');
	const base = dot === -1 ? fileName : fileName.slice(0, dot);
	return base.toLowerCase() as IndiceName;
};

/**
 * Removes the literal 0 placeholders that fill empty slots in each
 * índice array. The legacy data converter at
 * https://github.com/horacioMartinez/dakara-client/blob/master/tools/misc/traductor%20de%20indices%20y%20mapas/indices/traductor_indices.py
 * preallocates each result array sized to (max id + buffer) and
 * overwrites only the slots whose ID appears in the source file,
 * leaving an unused 0 in every other position. Consumers want a dense
 * object array with those gaps removed.
 */
export const stripZeroSentinels = (
	raw: ReadonlyArray<unknown>,
): ReadonlyArray<unknown> => {
	return raw.filter((entry) => {
		return entry !== 0;
	});
};

/** Parsed and zero-stripped content of a single índice file. */
export type ParsedIndice = {
	name: IndiceName;
	entries: ReadonlyArray<unknown>;
};

export type IndiceParseResult =
	| { success: true; parsed: ParsedIndice }
	| {
			success: false;
			reason: 'invalid-json' | 'schema-mismatch';
			detail: string;
	  };

/**
 * Parses an índice file's raw text: JSON-parses it, strips zero
 * sentinels, then validates against the per-índice Zod schema.
 * Returns a tagged result so callers can pick the right toast
 * message and forward the technical detail to the logger without
 * having to re-parse.
 */
export const parseIndiceFile = (
	fileName: string,
	rawText: string,
): IndiceParseResult => {
	const name = getIndiceBasename(fileName);

	let json: unknown;
	try {
		json = JSON.parse(rawText);
	} catch (error) {
		const detail =
			error instanceof Error ? error.message : String(error);
		return { success: false, reason: 'invalid-json', detail };
	}

	if (!Array.isArray(json)) {
		return {
			success: false,
			reason: 'schema-mismatch',
			detail: 'el archivo debe ser un array JSON',
		};
	}

	const result = INDICE_SCHEMAS[name].safeParse(
		stripZeroSentinels(json),
	);

	if (!result.success) {
		return {
			success: false,
			reason: 'schema-mismatch',
			detail: JSON.stringify(result.error.issues, null, 2),
		};
	}

	return { success: true, parsed: { name, entries: result.data } };
};
