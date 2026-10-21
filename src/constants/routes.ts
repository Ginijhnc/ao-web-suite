import type { ValueOf } from '../types/utility-types';

export const ROUTES = {
	HOME: '/home',
	INDEXADOR: '/indexador',
	DATEADOR: '/dateador',
	MAPEADOR: '/mapeador',
	TUTORIAL: '/tutorial',
	LOGS: '/logs',
	CONFIGURACION: '/configuracion',
} as const;

export const ROUTES_TITLES: Record<RouteKey, string> = {
	HOME: 'Home',
	INDEXADOR: 'Indexador',
	DATEADOR: 'Dateador',
	MAPEADOR: 'Mapeador',
	TUTORIAL: 'Tutorial',
	LOGS: 'Logs',
	CONFIGURACION: 'Configuración',
};

export type RouteKey = keyof typeof ROUTES;

export type RouteValue = ValueOf<typeof ROUTES>;
