import type { ValueOf } from '@Types/utility-types';

export const DATS_ACCEPTED_EXTENSIONS = '.dat';

export const DAT_NAMES = {
	NPCS: 'npcs',
	OBJ: 'obj',
	HECHIZOS: 'hechizos',
} as const;

export type DatName = ValueOf<typeof DAT_NAMES>;

const EXPECTED_DATS = new Set<DatName>(Object.values(DAT_NAMES));

export const DAT_HEADER_KEYS = {
	[DAT_NAMES.NPCS]: 'NumNPCs',
	[DAT_NAMES.OBJ]: 'NumOBJs',
	[DAT_NAMES.HECHIZOS]: 'NumeroHechizos',
} as const satisfies Record<DatName, string>;

/**
 * Section-name prefix for each file. Entries inside a .dat are tagged
 * [NPCn], [OBJn], [HECHIZOn]; the parser extracts the trailing integer
 * after stripping this prefix.
 */
export const DAT_SECTION_PREFIXES = {
	[DAT_NAMES.NPCS]: 'NPC',
	[DAT_NAMES.OBJ]: 'OBJ',
	[DAT_NAMES.HECHIZOS]: 'HECHIZO',
} as const satisfies Record<DatName, string>;

export const NUMBER_FIELD_BY_DAT = {
	[DAT_NAMES.NPCS]: 'npcNumber',
	[DAT_NAMES.OBJ]: 'objNumber',
	[DAT_NAMES.HECHIZOS]: 'hechizoNumber',
} as const satisfies Record<DatName, string>;

export const HEADER_FIELD_BY_DAT = {
	[DAT_NAMES.NPCS]: 'numNpcs',
	[DAT_NAMES.OBJ]: 'numObjs',
	[DAT_NAMES.HECHIZOS]: 'numeroHechizos',
} as const satisfies Record<DatName, string>;

export const CATEGORY_FIELDS_BY_DAT = {
	[DAT_NAMES.NPCS]: ['npcCategories'],
	[DAT_NAMES.OBJ]: ['objCategories', 'potionCategories'],
	[DAT_NAMES.HECHIZOS]: ['hechizoTypes', 'hechizoTargets'],
} as const satisfies Record<DatName, ReadonlyArray<string>>;

export const DAT_COMENTARIO_KEY = 'datComentario';

export const NPC_INDEXED_PREFIXES = [
	'Obj',
	'Drop',
	'CI',
	'CN',
	'Sp',
	'Snd',
	'EXP',
] as const;

export const OBJ_INDEXED_PREFIXES = ['CP', 'SND'] as const;

/**
 * Returns whether the given file name (case-insensitive, with or
 * without extension) corresponds to one of the three recognized dats.
 */
export const isValidDatName = (rawName: string): boolean => {
	const dot = rawName.lastIndexOf('.');
	const base = (
		dot === -1 ? rawName : rawName.slice(0, dot)
	).toLowerCase();
	return EXPECTED_DATS.has(base as DatName);
};
