import {
	CodeIcon,
	PanelIcon,
	DatsIcon,
	ErrorOutlineIcon,
	ImageIcon,
	IndexingDataIcon,
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
		icon: PanelIcon,
		requiresAssets: true,
		disabled: false,
	},
	{
		label: ROUTES_TITLES.RECURSOS,
		route: ROUTES.RECURSOS,
		icon: ImageIcon,
		requiresAssets: false,
		disabled: false,
	},
	{
		label: ROUTES_TITLES.INDEXADOR,
		route: ROUTES.INDEXADOR,
		icon: IndexingDataIcon,
		requiresAssets: true,
		disabled: false,
	},
	{
		label: ROUTES_TITLES.DATEADOR,
		route: ROUTES.DATEADOR,
		icon: DatsIcon,
		requiresAssets: true,
		disabled: false,
	},
	{
		label: ROUTES_TITLES.MAPEADOR,
		route: ROUTES.MAPEADOR,
		icon: MapeadorIcon,
		requiresAssets: false,
		disabled: true,
	},
	{
		label: ROUTES_TITLES.TUTORIAL,
		route: ROUTES.TUTORIAL,
		icon: TutorialIcon,
		requiresAssets: false,
		disabled: false,
	},
	{
		label: ROUTES_TITLES.LOGS,
		route: ROUTES.LOGS,
		icon: ErrorOutlineIcon,
		requiresAssets: false,
		disabled: false,
	},
	{
		label: ROUTES_TITLES.CONFIGURACION,
		route: ROUTES.CONFIGURACION,
		icon: SettingsIcon,
		requiresAssets: false,
		disabled: false,
	},
];

export const SIDEBAR_EXTERNAL_LINKS: ReadonlyArray<SidebarExternalLink> = [
	{
		label: 'Código',
		href: 'https://github.com',
		icon: CodeIcon,
	},
];
