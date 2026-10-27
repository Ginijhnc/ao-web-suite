import type { ValueOf } from '@Types/utility-types';

export const INDICES_ACCEPTED_EXTENSIONS = '.json';

export const INDICES_NAMES = {
	ARMAS: 'armas',
	CABEZAS: 'cabezas',
	CASCOS: 'cascos',
	CUERPOS: 'cuerpos',
	ESCUDOS: 'escudos',
	FXS: 'fxs',
	GRAFICOS: 'graficos',
} as const;

export type IndiceName = ValueOf<typeof INDICES_NAMES>;

const EXPECTED_INDICES = new Set<IndiceName>(Object.values(INDICES_NAMES));

/**
 * Returns whether the given file name (case-insensitive, with or without
 * extension) corresponds to one of the seven recognized índices.
 */
export const isValidIndiceName = (rawName: string): boolean => {
	const dot = rawName.lastIndexOf('.');
	const base = (
		dot === -1 ? rawName : rawName.slice(0, dot)
	).toLowerCase();
	return EXPECTED_INDICES.has(base as IndiceName);
};
