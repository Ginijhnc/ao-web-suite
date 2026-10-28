import {
	DAT_COMENTARIO_KEY,
	NPC_INDEXED_PREFIXES,
	NUMBER_FIELD_BY_DAT,
	DAT_NAMES,
} from '@Constants/dats';
import {
	HeadingSchema,
	ItemSchema,
	BinaryFlag,
	NumNpcsSchema,
	datCategoriesSchema,
	makeUnknownKeyRefinement,
} from '@Types/dats/common';
import { z } from 'zod';

const npcEntryBaseSchema = z
	.object({
		Name: z.string(),
		NpcType: z.number().int(),
		Desc: z.string(),

		Head: z.number().int(),
		Heading: HeadingSchema,
		Body: z.number().int(),
		Movement: z.number().int(),

		Attackable: BinaryFlag,
		ReSpawn: BinaryFlag,
		Hostile: BinaryFlag,
		Domable: z.number().int(),
		Comercia: BinaryFlag,
		BackUp: BinaryFlag,
		InvReSpawn: BinaryFlag,
		AguaValida: BinaryFlag,
		TierraInvalida: BinaryFlag,
		AtacaDoble: BinaryFlag,
		AfectaParalisis: BinaryFlag,
		GolpeExacto: BinaryFlag,
		GuardiaPersigue: BinaryFlag,
		Veneno: BinaryFlag,

		Alineacion: z.number().int(),
		Faccion: z.number().int(),
		TipoItems: z.number().int(),
		NROITEMS: z.number().int(),
		NROEXP: z.number().int(),
		EXP: z.number().int(),

		GiveEXP: z.number().int(),
		GiveGLD: z.number().int(),
		MinHP: z.number().int(),
		MaxHP: z.number().int(),
		MinHIT: z.number().int(),
		MaxHIT: z.number().int(),
		DEF: z.number().int(),
		DefM: z.number().int(),
		PoderAtaque: z.number().int(),
		PoderEvasion: z.number().int(),
		LanzaSpells: z.number().int(),

		NroCriaturas: z.number().int(),
		Ciudad: z.number().int(),
		PosOrig: z.number().int(),
	})
	/* .catchall only validates the value type of extra keys. it does not
	 * validate key names. A key like SecondaryDescription=Test passes here
	 * because "Test" is a string. Key name validation is the job of
	 * .superRefine on npcEntrySchema: only schema fields and recognized
	 * indexed families (Obj1..N, Drop1..N, CI1..N, CN1..N, Sp1..N,
	 * Snd1..N) are allowed there. Anything else (like SecondaryDescription)
	 * is rejected at that stage, not here. */
	.catchall(z.union([ItemSchema, z.string(), z.number()]));

const NPC_KNOWN_KEYS = new Set(Object.keys(npcEntryBaseSchema.shape));

const NPC_RESERVED_KEYS = new Set([
	NUMBER_FIELD_BY_DAT[DAT_NAMES.NPCS],
	DAT_COMENTARIO_KEY,
]);

export const npcEntrySchema = npcEntryBaseSchema
	.partial()
	.extend({
		npcNumber: z.number().int().nonnegative(),
		datComentario: z.string().optional(),
	})
	.superRefine(
		makeUnknownKeyRefinement(
			NPC_KNOWN_KEYS,
			NPC_RESERVED_KEYS,
			NPC_INDEXED_PREFIXES,
		),
	);

export const npcsDatSchema = z.object({
	numNpcs: NumNpcsSchema,
	npcCategories: datCategoriesSchema,
	entries: z.array(npcEntrySchema).min(1),
});

export const NPC_ENTRY_KEYS = Object.keys(
	npcEntryBaseSchema.shape,
) as ReadonlyArray<string>;

export type NpcEntry = z.infer<typeof npcEntrySchema>;
export type NpcsDat = z.infer<typeof npcsDatSchema>;
