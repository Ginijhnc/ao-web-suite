import {
	CodeIcon,
	DatsIcon,
	HomeIcon,
	ImageIcon,
	IndexingDataIcon,
	LogsIcon,
	MapeadorIcon,
	SettingsIcon,
	TutorialIcon,
} from '@Components/icons';
import { ROUTES, ROUTES_TITLES } from '@Constants/routes';
import type {
	SidebarExternalLink,
	SidebarInternalLink,
} from './Sidebar.types';

export const SIDEBAR_INTERNAL_LINKS: ReadonlyArray<SidebarInternalLink> = [
	{
		label: ROUTES_TITLES.OVERVIEW,
		route: ROUTES.OVERVIEW,
		icon: HomeIcon,
	},
	{
		label: ROUTES_TITLES.ROOT,
		route: ROUTES.ROOT,
		icon: ImageIcon,
	},
	{
		label: ROUTES_TITLES.INDEXADOR,
		route: ROUTES.INDEXADOR,
		icon: IndexingDataIcon,
	},
	{
		label: ROUTES_TITLES.DATEADOR,
		route: ROUTES.DATEADOR,
		icon: DatsIcon,
	},
	{
		label: ROUTES_TITLES.MAPEADOR,
		route: ROUTES.MAPEADOR,
		icon: MapeadorIcon,
	},
	{
		label: ROUTES_TITLES.TUTORIAL,
		route: ROUTES.TUTORIAL,
		icon: TutorialIcon,
	},
	{ label: ROUTES_TITLES.LOGS, route: ROUTES.LOGS, icon: LogsIcon },
	{
		label: ROUTES_TITLES.CONFIGURACION,
		route: ROUTES.CONFIGURACION,
		icon: SettingsIcon,
	},
];

export const SIDEBAR_EXTERNAL_LINKS: ReadonlyArray<SidebarExternalLink> = [
	{
		label: 'Código',
		href: 'https://github.com',
		icon: CodeIcon,
	},
];
