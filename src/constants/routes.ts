import type { ValueOf } from '../types/utility-types';

export const ROUTES = {
	RECURSOS: '/recursos',
	OVERVIEW: '/panel',
	INDEXADOR: '/indexador',
	DATEADOR: '/dateador',
	MAPEADOR: '/mapeador',
	TUTORIAL: '/tutorial',
	LOGS: '/logs',
	CONFIGURACION: '/configuracion',
} as const;

export const ROUTES_TITLES: Record<RouteKey, string> = {
	RECURSOS: 'Recursos',
	OVERVIEW: 'Panel',
	INDEXADOR: 'Indexador',
	DATEADOR: 'Dateador',
	MAPEADOR: 'Mapeador',
	TUTORIAL: 'Tutorial',
	LOGS: 'Logs',
	CONFIGURACION: 'Configuración',
};

export type RouteKey = keyof typeof ROUTES;

export type RouteValue = ValueOf<typeof ROUTES>;

export type RouteTitleValue = ValueOf<typeof ROUTES_TITLES>;
