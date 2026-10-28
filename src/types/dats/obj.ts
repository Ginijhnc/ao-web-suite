import {
	DAT_COMENTARIO_KEY,
	DAT_NAMES,
	NUMBER_FIELD_BY_DAT,
	OBJ_INDEXED_PREFIXES,
} from '@Constants/dats';
import {
	BinaryFlag,
	NumObjsSchema,
	datCategoriesSchema,
	makeUnknownKeyRefinement,
} from '@Types/dats/common';
import { z } from 'zod';

const objEntryBaseSchema = z
	.object({
		Name: z.string(),
		GrhIndex: z.number().int(),
		ObjType: z.number().int(),

		Agarrable: BinaryFlag,
		Crucial: BinaryFlag,
		Caos: BinaryFlag,
		Real: BinaryFlag,
		Madera: z.number().int(),
		MaderaElfica: z.number().int(),
		NoSeCae: BinaryFlag,
		Newbie: BinaryFlag,
		Proyectil: BinaryFlag,
		Acuchilla: BinaryFlag,
		Hombre: BinaryFlag,
		Mujer: BinaryFlag,
		RazaEnana: BinaryFlag,
		RazaDrow: BinaryFlag,
		Guante: BinaryFlag,
		VGrande: z.number().int(),
		Refuerzo: z.number().int(),
		Envenena: BinaryFlag,
		Apuñala: BinaryFlag,
		StaffAffected: BinaryFlag,

		MinHAM: z.number().int(),
		MinHP: z.number().int(),
		Valor: z.number().int(),
		Anim: z.number().int(),
		RazaEnanaAnim: z.number().int(),
		MinHit: z.number().int(),
		MaxHit: z.number().int(),
		MinDef: z.number().int(),
		MaxDef: z.number().int(),
		DefensaMagicaMin: z.number().int(),
		DefensaMagicaMax: z.number().int(),
		MinSkill: z.number().int(),
		MinAgu: z.number().int(),
		MinST: z.number().int(),
		Respawn: z.number().int(),

		LingH: z.number().int(),
		LingP: z.number().int(),
		LingO: z.number().int(),
		SkHerreria: z.number().int(),
		SkCarpinteria: z.number().int(),
		MineralIndex: z.number().int(),
		Lingoteindex: z.number().int(),

		Abierta: BinaryFlag,
		Llave: BinaryFlag,
		IndexAbierta: z.number().int(),
		IndexCerrada: z.number().int(),
		IndexCerradaLlave: z.number().int(),
		Clave: z.number().int(),

		CantItems: z.number().int(),
		NroItems: z.number().int(),
		NumRopaje: z.number().int(),
		Texto: z.string(),
		Upgrade: z.number().int(),

		ID: z.string(),
		TipoPocion: z.number().int(),
		MinModificador: z.number().int(),
		MaxModificador: z.number().int(),
		DuracionEfecto: z.number().int(),

		HechizoIndex: z.number().int(),
		StaffPower: z.number().int(),
		StaffDamageBonus: z.number().int(),
		Radio: z.number().int(),
		SND: z.number().int(),
		Log: z.number().int(),
		Municiones: z.number().int(),
		MochilaType: z.number().int(),
	})
	/* .catchall only validates the value type of extra keys. it does not
	 * validate key names. A key like Wololo=0 passes here because 0 is a
	 * number. Key name validation is the job of .superRefine on
	 * objEntrySchema: only schema fields and the recognized indexed family
	 * (CP1..N, clases permitidas) are allowed there. Anything else (like Wololo)
	 * is rejected at that stage, not here. */
	.catchall(z.union([z.string(), z.number()]));

const OBJ_KNOWN_KEYS = new Set(Object.keys(objEntryBaseSchema.shape));

const OBJ_RESERVED_KEYS = new Set([
	NUMBER_FIELD_BY_DAT[DAT_NAMES.OBJ],
	DAT_COMENTARIO_KEY,
]);

export const objEntrySchema = objEntryBaseSchema
	.partial()
	.extend({
		objNumber: z.number().int().nonnegative(),
		datComentario: z.string().optional(),
	})
	.superRefine(
		makeUnknownKeyRefinement(
			OBJ_KNOWN_KEYS,
			OBJ_RESERVED_KEYS,
			OBJ_INDEXED_PREFIXES,
		),
	);

export const objDatSchema = z.object({
	numObjs: NumObjsSchema,
	objCategories: datCategoriesSchema,
	potionCategories: datCategoriesSchema,
	entries: z.array(objEntrySchema).min(1),
});

export const OBJ_ENTRY_KEYS = Object.keys(
	objEntryBaseSchema.shape,
) as ReadonlyArray<string>;

export type ObjEntry = z.infer<typeof objEntrySchema>;
export type ObjDat = z.infer<typeof objDatSchema>;
