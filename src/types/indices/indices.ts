import { INDICES_NAMES, type IndiceName } from '@Constants/indices';
import { z } from 'zod';

const directionalEntrySchema = z.object({
	id: z.number().int(),
	up: z.number().int(),
	down: z.number().int(),
	left: z.number().int(),
	right: z.number().int(),
});

const cuerposEntrySchema = directionalEntrySchema.extend({
	offHeadX: z.number().int(),
	offHeadY: z.number().int(),
});

const fxsEntrySchema = z.object({
	id: z.number().int(),
	animacion: z.number().int(),
	offX: z.number().int(),
	offY: z.number().int(),
});

const graficosStaticEntrySchema = z.object({
	id: z.number().int(),
	grafico: z.union([z.string(), z.number()]),
	offX: z.number().int(),
	offY: z.number().int(),
	width: z.number().int(),
	height: z.number().int(),
	css: z.number().int().optional(),
});

const graficosAnimationEntrySchema = z.object({
	id: z.number().int(),
	frames: z.array(z.number().int()).min(1),
	velocidad: z.number(),
});

const graficosEntrySchema = z.union([
	graficosAnimationEntrySchema,
	graficosStaticEntrySchema,
]);

export const armasIndiceSchema = z.array(directionalEntrySchema).min(1);
export const cabezasIndiceSchema = z.array(directionalEntrySchema).min(1);
export const cascosIndiceSchema = z.array(directionalEntrySchema).min(1);
export const escudosIndiceSchema = z.array(directionalEntrySchema).min(1);
export const cuerposIndiceSchema = z.array(cuerposEntrySchema).min(1);
export const fxsIndiceSchema = z.array(fxsEntrySchema).min(1);
export const graficosIndiceSchema = z.array(graficosEntrySchema).min(1);

/*
 * Maps each indice name to its Zod schema for runtime validation.
 * Centralizing here avoids a switch in parseIndiceFile and ensures
 * every indice type is covered at compile time via the satisfies check.
 */
export const INDICE_SCHEMAS = {
	[INDICES_NAMES.ARMAS]: armasIndiceSchema,
	[INDICES_NAMES.CABEZAS]: cabezasIndiceSchema,
	[INDICES_NAMES.CASCOS]: cascosIndiceSchema,
	[INDICES_NAMES.CUERPOS]: cuerposIndiceSchema,
	[INDICES_NAMES.ESCUDOS]: escudosIndiceSchema,
	[INDICES_NAMES.FXS]: fxsIndiceSchema,
	[INDICES_NAMES.GRAFICOS]: graficosIndiceSchema,
} satisfies Record<IndiceName, z.ZodType>;

export type DirectionalEntry = z.infer<typeof directionalEntrySchema>;
export type ArmasIndice = z.infer<typeof armasIndiceSchema>;
export type CabezasIndice = z.infer<typeof cabezasIndiceSchema>;
export type CascosIndice = z.infer<typeof cascosIndiceSchema>;
export type CuerposIndice = z.infer<typeof cuerposIndiceSchema>;
export type EscudosIndice = z.infer<typeof escudosIndiceSchema>;
export type FxsIndice = z.infer<typeof fxsIndiceSchema>;
export type GraficosIndice = z.infer<typeof graficosIndiceSchema>;

export type GraficosStaticEntry = z.infer<
	typeof graficosStaticEntrySchema
>;
export type GraficosAnimationEntry = z.infer<
	typeof graficosAnimationEntrySchema
>;
