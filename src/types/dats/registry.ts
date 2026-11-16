import { DAT_NAMES, type DatName } from '@Constants/dats';
import { hechizosDatSchema, HECHIZO_ENTRY_KEYS } from './hechizos';
import { npcsDatSchema, NPC_ENTRY_KEYS } from './npcs';
import { objDatSchema, OBJ_ENTRY_KEYS } from './obj';

type DatSchemas = {
	npcs: typeof npcsDatSchema;
	obj: typeof objDatSchema;
	hechizos: typeof hechizosDatSchema;
};

export const DAT_SCHEMAS = {
	[DAT_NAMES.NPCS]: npcsDatSchema,
	[DAT_NAMES.OBJ]: objDatSchema,
	[DAT_NAMES.HECHIZOS]: hechizosDatSchema,
} as const satisfies DatSchemas;

export const DAT_ENTRY_KEYS = {
	[DAT_NAMES.NPCS]: NPC_ENTRY_KEYS,
	[DAT_NAMES.OBJ]: OBJ_ENTRY_KEYS,
	[DAT_NAMES.HECHIZOS]: HECHIZO_ENTRY_KEYS,
} as const satisfies Record<DatName, ReadonlyArray<string>>;
