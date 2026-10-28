import { z } from 'zod';

export const BinaryFlag = z.union([z.literal(0), z.literal(1)], {
	message: 'Este campo sólo acepta los valores 0 o 1 (BinaryFlag).',
});

export const ItemSchema = z.string().regex(/^\d{1,4}-\d{1,5}$/, {
	message: 'Formato inválido para los items (ObjX y DropX).',
});

export const NumNpcsSchema = z.number({
	message:
		'El número de NPC debe ser un valor numérico entero. numNpcs representa el número de NPC mas alto, no la cantidad de NPCs.',
});

export const NumObjsSchema = z.number({
	message:
		'El número de OBJ debe ser un valor numérico entero. numObjs representa el número de OBJ mas alto, no la cantidad de OBJs.',
});

export const NumeroHechizosSchema = z.number({
	message: 'El número de hechizos debe ser un valor numérico entero.',
});

export const datCategoriesSchema = z.map(
	z.number().int().nonnegative(),
	z.string(),
);

export const HeadingSchema = z
	.number()
	.min(1, {
		message: 'Heading debe tener un valor entre 1 y 4 inclusive.',
	})
	.max(4, {
		message: 'Heading debe tener un valor entre 1 y 4 inclusive.',
	});

/**
 * Returns a Zod superRefine function that rejects any key not in
 * `knownKeys` or `reservedKeys` unless its base name (digits stripped
 * from the end) case-insensitively matches one of `indexedPrefixes`.
 * Use this to enforce strict key validation on schemas that use
 * `.catchall` to accommodate indexed families (e.g. Obj1..N).
 */
export const makeUnknownKeyRefinement = (
	knownKeys: ReadonlySet<string>,
	reservedKeys: ReadonlySet<string>,
	indexedPrefixes: ReadonlyArray<string>,
) => {
	return (data: Record<string, unknown>, ctx: z.RefinementCtx): void => {
		for (const key of Object.keys(data)) {
			if (knownKeys.has(key)) continue;
			if (reservedKeys.has(key)) continue;
			const base = key.replace(/\d+$/, '');
			const isIndexedFamily = indexedPrefixes.some((p) => {
				return p.toLowerCase() === base.toLowerCase();
			});
			if (!isIndexedFamily) {
				ctx.addIssue({
					code: 'custom',
					message: `Clave no reconocida: "${key}". Solo se permiten campos definidos en el esquema o familias indexadas como ${indexedPrefixes.join(', ')}.`,
				});
			}
		}
	};
};
