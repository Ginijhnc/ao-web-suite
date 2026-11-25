import { APP_NAME, ROUTES, ROUTES_TITLES } from '@Constants/routes';
import type { ValueOf } from '@Types/utility-types';
import { env } from '../env';

const defaultOgImage = `${env.SITE_URL}/og_default.png`;

export const DEFAULT_SITE_META = {
	siteUrl: env.SITE_URL,
	siteName: APP_NAME,
	ogImage: defaultOgImage,
} as const;

export const PAGES_META = {
	RECURSOS: {
		title: `${ROUTES_TITLES.RECURSOS} · ${APP_NAME}`,
		description:
			'Administrador y editor de recursos para Argentum Online Web.',
		canonical: `${env.SITE_URL}${ROUTES.RECURSOS}`,
		ogImage: defaultOgImage,
	},
	OVERVIEW: {
		title: `${ROUTES_TITLES.OVERVIEW} · ${APP_NAME}`,
		description: 'Panel de control y resumen general de AOWeb Suite.',
		canonical: `${env.SITE_URL}${ROUTES.OVERVIEW}`,
		ogImage: defaultOgImage,
	},
	LOGS: {
		title: `${ROUTES_TITLES.LOGS} · ${APP_NAME}`,
		description: 'Visualización de logs de AOWeb Suite.',
		canonical: `${env.SITE_URL}${ROUTES.LOGS}`,
		ogImage: defaultOgImage,
	},
	TUTORIAL: {
		title: `${ROUTES_TITLES.TUTORIAL} · ${APP_NAME}`,
		description: 'Guía de uso de AOWeb Suite.',
		canonical: `${env.SITE_URL}${ROUTES.TUTORIAL}`,
		ogImage: defaultOgImage,
	},
	INDEXADOR: {
		title: `${ROUTES_TITLES.INDEXADOR} · ${APP_NAME}`,
		description: 'Indexador para Argentum Online Web.',
		canonical: `${env.SITE_URL}${ROUTES.INDEXADOR}`,
		ogImage: defaultOgImage,
	},
} as const;

export type PageMetaEntry = ValueOf<typeof PAGES_META>;
