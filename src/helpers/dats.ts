import {
	CATEGORY_FIELDS_BY_DAT,
	DAT_HEADER_KEYS,
	DAT_SECTION_PREFIXES,
	HEADER_FIELD_BY_DAT,
	NUMBER_FIELD_BY_DAT,
	type DatName,
} from '@Constants/dats';
import { DAT_ENTRY_KEYS, DAT_SCHEMAS } from '@Types/dats';

type RawPair = {
	key: string;
	value: string;
};

type RawSection = {
	header: string;
	headerComment?: string;
	pairs: ReadonlyArray<RawPair>;
};

/**
 * Strips a trailing `'comment` suffix from a value and trims
 * surrounding whitespace. The first `'` preceded by whitespace (or at
 * the start of the string) marks the comment. The whitespace check lets
 * `O'Riley` survive intact: the apostrophe inside a word is not
 * treated as a comment delimiter.
 */
export const stripInlineComment = (raw: string): string => {
	let i = 0;
	while (i < raw.length) {
		const char = raw[i];
		if (char === "'" && (i === 0 || /\s/.test(raw[i - 1] ?? ''))) {
			return raw.slice(0, i).trim();
		}
		i += 1;
	}
	return raw.trim();
};

/**
 * Captures the inline comment from a `[SECTION] ' some note` header
 * line. Returns trimmed text or undefined if none present.
 */
export const extractHeaderComment = (
	headerLine: string,
): string | undefined => {
	const apos = headerLine.indexOf("'");
	if (apos === -1) return undefined;
	const sliced = headerLine.slice(apos + 1);
	const comment = sliced.trim();
	return comment.length > 0 ? comment : undefined;
};

/**
 * Parses one logical line by splitting on the first `=` and stripping
 * inline comments from the value. Returns null if no `=` is found or
 * the key is empty.
 */
const splitKeyValue = (line: string): RawPair | null => {
	const eq = line.indexOf('=');
	if (eq === -1) return null;
	const key = line.slice(0, eq).trim();
	if (key.length === 0) return null;
	const value = stripInlineComment(line.slice(eq + 1));
	return { key, value };
};

/**
 * Returns true if the line is blank or a comment line (starts with
 * `#` or `'`). Used to skip legacy banner separators and comments.
 * Example: skips lines like `# ====== SECTION HEADER` or `' old comment`.
 */
const isSkippableLine = (line: string): boolean => {
	if (line.length === 0) return true;
	return line.startsWith('#') || line.startsWith("'");
};

/**
 * Parses a `[HEADER]` line and extracts the section name and any
 * trailing comment. Returns null if the closing bracket is not found.
 */
const startSection = (
	line: string,
): {
	header: string;
	headerComment?: string;
	pairs: Array<RawPair>;
} | null => {
	const close = line.indexOf(']');
	if (close === -1) return null;
	const header = line.slice(1, close).trim();
	const tail = line.slice(close + 1);
	return {
		header,
		headerComment: extractHeaderComment(tail),
		pairs: [],
	};
};

type MutableSection = {
	header: string;
	headerComment?: string;
	pairs: Array<RawPair>;
};

/**
 * Processes a single line: routes to section parsing if it is a
 * `[HEADER]` line, adds key-value pairs to the current section, or
 * skips comments and blanks. Returns the current section state.
 */
const processLine = (
	line: string,
	sections: Array<RawSection>,
	current: MutableSection | null,
): MutableSection | null => {
	if (isSkippableLine(line)) return current;

	if (line.startsWith('[')) {
		if (current) sections.push(current);
		return startSection(line);
	}

	if (!current) return null;
	const pair = splitKeyValue(line);
	if (pair) current.pairs.push(pair);
	return current;
};

/**
 * Walks the .dat text once, emitting one RawSection per `[HEADER]`
 * marker. Lines before the first section are dropped (the NPCs
 * categories preamble is parsed separately from the same raw text).
 */
export const parseIniSections = (
	rawText: string,
): ReadonlyArray<RawSection> => {
	const sections: Array<RawSection> = [];
	let current: MutableSection | null = null;

	for (const rawLine of rawText.split(/\r?\n/)) {
		const line = rawLine.trimStart();
		current = processLine(line, sections, current);
	}

	if (current) sections.push(current);
	return sections;
};

/**
 * Coerces a raw value string to a number if it parses as a finite
 * number, else returns the original string. Applied before Zod
 * validation so numeric fields arrive as numbers.
 */
const coerceValue = (raw: string): string | number => {
	if (raw.length === 0) return raw;
	const n = Number(raw);
	if (Number.isFinite(n) && raw.trim() !== '') return n;
	return raw;
};

/**
 * Maps a raw (possibly mis-cased) key to its canonical schema form
 * by case-insensitive lookup. Handles direct keys (attackable ->
 * Attackable) and indexed families where digits are stripped first
 * (obj10 -> Obj, then matches against Obj base).
 */
export const findCanonicalKey = (
	rawKey: string,
	canonicalKeys: ReadonlyArray<string>,
): string | null => {
	const lower = rawKey.toLowerCase();
	const direct = canonicalKeys.find((k) => {
		return k.toLowerCase() === lower;
	});
	if (direct) return direct;

	const baseLower = lower.replace(/\d+$/, '');
	if (baseLower === lower) return null;

	const base = canonicalKeys.find((k) => {
		return k.toLowerCase() === baseLower;
	});
	if (!base) return null;

	const suffix = rawKey.slice(baseLower.length);
	return base + suffix;
};

/**
 * Builds the per-entry object that Zod validates. Unknown keys fall
 * through to the schema's catchall so a future field gained by the
 * legacy tooling does not force a schema migration.
 */
export const mapPairsToEntry = (
	pairs: ReadonlyArray<RawPair>,
	canonicalKeys: ReadonlyArray<string>,
): Record<string, string | number> => {
	const entry: Record<string, string | number> = {};
	for (const { key, value } of pairs) {
		const target = findCanonicalKey(key, canonicalKeys) ?? key;
		entry[target] = coerceValue(value);
	}
	return entry;
};

/**
 * Parses the categories preamble of NPCs.dat:
 * 0 ====== NPCS COMUNES
 * 1 ====== PUEDE RESUCITAR
 *
 * Stops at the first `[section]` marker so a categories line is never
 * confused with an entry pair. Lines that don't match the pattern are
 * skipped (banner separators, blank lines, etc.).
 */
export const parseNpcCategories = (
	rawText: string,
): Map<number, string> => {
	const result = new Map<number, string>();
	const pattern = /^\s*(\d+)\s*=+\s*(.+?)\s*$/;
	for (const line of rawText.split(/\r?\n/)) {
		if (line.trimStart().startsWith('[')) break;
		const match = pattern.exec(line);
		if (!match?.[2]) continue;
		const id = Number(match[1]);
		if (!Number.isFinite(id)) continue;
		result.set(id, match[2].trim());
	}
	return result;
};

/**
 * Advances to a new segment on a `###` banner line. A new array is
 * only pushed when the current segment is non-empty, so consecutive
 * banners don't produce spurious empty segments.
 */
const advanceSegment = (
	segments: Array<Array<string>>,
	current: Array<string>,
): Array<string> => {
	if (current.length > 0) {
		segments.push(current);
		return [];
	}
	return current;
};

/**
 * Collects all lines into `segments`, flushing the trailing in-progress
 * segment after the loop. Stops at the first `[section]` marker.
 */
const collectObjPreambleLines = (
	rawText: string,
): Array<Array<string>> => {
	const segments: Array<Array<string>> = [];
	let current: Array<string> = [];
	for (const line of rawText.split(/\r?\n/)) {
		const trimmed = line.trimStart();
		if (trimmed.startsWith('[')) break;
		if (trimmed.startsWith('#')) {
			current = advanceSegment(segments, current);
			continue;
		}
		current.push(line);
	}
	if (current.length > 0) segments.push(current);
	return segments;
};

/**
 * Splits the obj.dat preamble into segments separated by `###` banner
 * lines. The first segment contains ObjType labels, the second contains
 * TipoPocion labels. Further segments are ignored.
 */
const splitObjPreambleSegments = (rawText: string): [string, string] => {
	const segments = collectObjPreambleLines(rawText);
	return [segments[0]?.join('\n') ?? '', segments[1]?.join('\n') ?? ''];
};

/**
 * Parses `' N: Label` lines from a raw text segment into a Map.
 * Lines that don't match the pattern are skipped.
 */
const parseApostropheCategories = (
	segment: string,
): Map<number, string> => {
	const result = new Map<number, string>();
	const pattern = /^'\s*(\d+)[.:]*\s*(.+?)\s*$/;
	for (const line of segment.split(/\r?\n/)) {
		const match = pattern.exec(line.trimStart());
		if (!match?.[2]) continue;
		const id = Number(match[1]);
		if (!Number.isFinite(id)) continue;
		result.set(id, match[2].trim());
	}
	return result;
};

/**
 * Parses the ObjType categories preamble of obj.dat.
 */
export const parseObjCategories = (
	rawText: string,
): Map<number, string> => {
	const [segment] = splitObjPreambleSegments(rawText);
	return parseApostropheCategories(segment);
};

/**
 * Parses the TipoPocion categories preamble of obj.dat.
 */
export const parsePotionCategories = (
	rawText: string,
): Map<number, string> => {
	const [, segment] = splitObjPreambleSegments(rawText);
	return parseApostropheCategories(segment);
};

/**
 * Splits the Hechizos.dat preamble into [tipos, targets] by finding the
 * line that starts with `'Targets`.
 */
const splitHechizosPreambleSegments = (
	rawText: string,
): [string, string] => {
	const lines = rawText.split(/\r?\n/);
	const tipoLines: Array<string> = [];
	const targetLines: Array<string> = [];
	let inTargets = false;
	for (const line of lines) {
		if (line.trimStart().startsWith('[')) break;
		if (/^'Targets/i.test(line.trimStart())) {
			inTargets = true;
			continue;
		}
		if (inTargets) {
			targetLines.push(line);
		} else {
			tipoLines.push(line);
		}
	}
	return [tipoLines.join('\n'), targetLines.join('\n')];
};

/**
 * Parses the Tipo categories preamble of Hechizos.dat.
 */
export const parseHechizoTypes = (
	rawText: string,
): Map<number, string> => {
	const [segment] = splitHechizosPreambleSegments(rawText);
	return parseApostropheCategories(segment);
};

/**
 * Parses the Target categories preamble of Hechizos.dat.
 */
export const parseHechizoTargets = (
	rawText: string,
): Map<number, string> => {
	const [, segment] = splitHechizosPreambleSegments(rawText);
	return parseApostropheCategories(segment);
};

export type ParsedDat = {
	name: DatName;
	data: unknown;
};

export type DatParseResult =
	| { success: true; parsed: ParsedDat }
	| {
			success: false;
			reason: 'missing-header' | 'no-entries' | 'schema-mismatch';
			detail: string;
	  };

/**
 * Extracts the lowercase basename (filename without extension) so it
 * can be matched against the DatName union. Used before every schema
 * lookup and IDB write so casing in the file name never matters.
 */
export const getDatBasename = (fileName: string): DatName => {
	const dot = fileName.lastIndexOf('.');
	const base = dot === -1 ? fileName : fileName.slice(0, dot);
	return base.toLowerCase() as DatName;
};

/**
 * Extracts the numeric value of a header key from the [INIT] section.
 * Case-insensitive matching. Returns null if the section or key is
 * not found, or if the value is not a finite number.
 */
const extractHeader = (
	sections: ReadonlyArray<RawSection>,
	headerKey: string,
): number | null => {
	const init = sections.find((s) => {
		return s.header.toUpperCase() === 'INIT';
	});
	if (!init) return null;
	const pair = init.pairs.find((p) => {
		return p.key.toLowerCase() === headerKey.toLowerCase();
	});
	if (!pair) return null;
	const n = Number(pair.value);
	return Number.isFinite(n) ? n : null;
};

/**
 * Builds the entries array from every `[PREFIXn]` section (e.g., [NPC1],
 * [OBJ42], [HECHIZO5]). Maps raw key-value pairs to canonical form, adds
 * the entry number, and captures any header comment as `datComentario`.
 */
const buildEntries = (
	sections: ReadonlyArray<RawSection>,
	prefix: string,
	numberField: string,
	canonicalKeys: ReadonlyArray<string>,
): Array<Record<string, unknown>> => {
	const entries: Array<Record<string, unknown>> = [];
	const lowerPrefix = prefix.toLowerCase();
	for (const s of sections) {
		if (!s.header.toLowerCase().startsWith(lowerPrefix)) continue;
		const num = Number(s.header.slice(prefix.length));
		if (!Number.isFinite(num)) continue;
		const entry: Record<string, unknown> = mapPairsToEntry(
			s.pairs,
			canonicalKeys,
		);
		entry[numberField] = num;
		if (s.headerComment) entry['datComentario'] = s.headerComment;
		entries.push(entry);
	}
	return entries;
};

/**
 * Maps each category payload field to its parser function.
 * Keyed by every field name that can appear in
 * `CATEGORY_FIELDS_BY_DAT` so the compiler enforces exhaustiveness.
 */
const CATEGORY_PARSERS = {
	npcCategories: parseNpcCategories,
	objCategories: parseObjCategories,
	potionCategories: parsePotionCategories,
	hechizoTypes: parseHechizoTypes,
	hechizoTargets: parseHechizoTargets,
} as const satisfies Record<
	(typeof CATEGORY_FIELDS_BY_DAT)[DatName][number],
	(rawText: string) => Map<number, string>
>;

/**
 * Appends the preamble category maps to `payload` for the given dat.
 * Which fields are written is driven by `CATEGORY_FIELDS_BY_DAT` so
 * adding a new dat variant only requires updating the constants file.
 */
const attachCategories = (
	name: DatName,
	rawText: string,
	payload: Record<string, unknown>,
): void => {
	for (const field of CATEGORY_FIELDS_BY_DAT[name]) {
		payload[field] = CATEGORY_PARSERS[field](rawText);
	}
};

/**
 * Parses a .dat file's raw text: tokenize INI sections, extract
 * header counter, build per-entry objects (case-insensitive key
 * lookup, items typed as ItemSchema strings), and validate against
 * the per-dat Zod schema via safeParse. Returns a tagged result so
 * callers can pick the right toast and forward the technical detail
 * to the logger without re-parsing.
 */
export const parseDatFile = (
	fileName: string,
	rawText: string,
): DatParseResult => {
	const name = getDatBasename(fileName);
	const sections = parseIniSections(rawText);

	const headerKey = DAT_HEADER_KEYS[name];
	const headerValue = extractHeader(sections, headerKey);
	if (headerValue === null) {
		return {
			success: false,
			reason: 'missing-header',
			detail: `falta [INIT].${headerKey}`,
		};
	}

	const entries = buildEntries(
		sections,
		DAT_SECTION_PREFIXES[name],
		NUMBER_FIELD_BY_DAT[name],
		DAT_ENTRY_KEYS[name],
	);
	if (entries.length === 0) {
		return {
			success: false,
			reason: 'no-entries',
			detail: `no se encontraron secciones [${DAT_SECTION_PREFIXES[name]}N]`,
		};
	}

	const payload: Record<string, unknown> = {
		[HEADER_FIELD_BY_DAT[name]]: headerValue,
		entries,
	};
	attachCategories(name, rawText, payload);

	const result = DAT_SCHEMAS[name].safeParse(payload);
	if (!result.success) {
		return {
			success: false,
			reason: 'schema-mismatch',
			detail: JSON.stringify(result.error.issues, null, 2),
		};
	}

	return { success: true, parsed: { name, data: result.data } };
};
