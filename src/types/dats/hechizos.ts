import {
	BinaryFlag,
	NumeroHechizosSchema,
	datCategoriesSchema,
} from '@Types/dats/common';
import { z } from 'zod';

const hechizoEntryBaseSchema = z.object({
	Nombre: z.string(),
	Desc: z.string(),
	PalabrasMagicas: z.string(),
	HechizeroMsg: z.string(),
	PropioMsg: z.string(),
	TargetMsg: z.string(),

	Tipo: z.number().int(),
	WAV: z.number().int(),
	FXgrh: z.number().int(),
	Loops: z.number().int(),
	MinSkill: z.number().int(),
	ManaRequerido: z.number().int(),
	StaRequerido: z.number().int(),
	Target: z.number().int(),

	SubeHP: z.number().int(),
	MinHP: z.number().int(),
	MaxHP: z.number().int(),
	SubeMana: BinaryFlag,
	MinMana: z.number().int(),
	MaxMana: z.number().int(),
	SubeSta: BinaryFlag,
	MinSta: z.number().int(),
	MaxSta: z.number().int(),
	SubeHam: z.number().int(),
	MinHam: z.number().int(),
	MaxHam: z.number().int(),
	SubeSed: BinaryFlag,
	MinSed: z.number().int(),
	MaxSed: z.number().int(),
	SubeAG: z.number().int(),
	MinAG: z.number().int(),
	MaxAG: z.number().int(),
	SubeFU: z.number().int(),
	MinFU: z.number().int(),
	MaxFU: z.number().int(),
	SubeCA: BinaryFlag,
	MinCA: z.number().int(),
	MaxCA: z.number().int(),

	Invisibilidad: BinaryFlag,
	Paraliza: BinaryFlag,
	Inmoviliza: BinaryFlag,
	RemoverParalisis: BinaryFlag,
	RemoverEstupidez: BinaryFlag,
	RemueveInvisibilidadParcial: BinaryFlag,
	CuraVeneno: BinaryFlag,
	Envenena: BinaryFlag,
	Revivir: BinaryFlag,
	Ceguera: BinaryFlag,
	Estupidez: BinaryFlag,
	Invoca: BinaryFlag,
	Mimetiza: BinaryFlag,
	Materializa: BinaryFlag,
	StaffAffected: BinaryFlag,
	NeedStaff: z.number().int(),

	NumNpc: z.number().int(),
	Cant: z.number().int(),
	itemindex: z.number().int(),
	Resis: z.number().int(),
	Warp: z.number().int(),
});

export const hechizoEntrySchema = hechizoEntryBaseSchema.partial().extend({
	hechizoNumber: z.number().int().nonnegative(),
	datComentario: z.string().optional(),
});

export const hechizosDatSchema = z.object({
	numeroHechizos: NumeroHechizosSchema,
	hechizoTypes: datCategoriesSchema,
	hechizoTargets: datCategoriesSchema,
	entries: z.array(hechizoEntrySchema).min(1),
});

export const HECHIZO_ENTRY_KEYS = Object.keys(
	hechizoEntryBaseSchema.shape,
) as ReadonlyArray<string>;

export type HechizoEntry = z.infer<typeof hechizoEntrySchema>;
export type HechizosDat = z.infer<typeof hechizosDatSchema>;
