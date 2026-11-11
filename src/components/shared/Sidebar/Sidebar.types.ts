import type { IconProps } from '@Components/icons';
import type { RouteTitleValue, RouteValue } from '@Constants/routes';
import type { ValueOf } from '@Types/utility-types';
import type { SIDEBAR_BADGE_KEYS } from './Sidebar.constants';

export type SidebarBadgeKey = ValueOf<typeof SIDEBAR_BADGE_KEYS>;

export type SidebarInternalLink = {
	label: RouteTitleValue;
	route: RouteValue;
	icon: (props: IconProps) => React.ReactElement;
	requiresAssets: boolean;
	disabled: boolean;
	badgeKey?: SidebarBadgeKey;
};

export type SidebarExternalLink = {
	label: string;
	href: string;
	icon: (props: IconProps) => React.ReactElement;
};

export type SidebarProps = {
	isMobileOpen: boolean;
	isCollapsed: boolean;
	onAfterNavigation: () => void;
	onToggleMobile: () => void;
	onToggleCollapse: () => void;
};

export type SidebarDesktopCollapseButtonProps = Pick<
	SidebarProps,
	'isCollapsed' | 'onToggleCollapse'
>;

export type SidebarMobileDrawerToggleProps = {
	isMobileOpen: boolean;
	onToggleMobile: () => void;
};

export type SidebarInternalLinkItemProps = {
	link: SidebarInternalLink;
	isActive: boolean;
	isCollapsed: boolean;
	isDisabled: boolean;
	showTooltip: boolean;
	badge?: React.ReactNode;
	onNavigate: (route: RouteValue) => void;
};

export type SidebarExternalLinkItemProps = {
	link: SidebarExternalLink;
	isCollapsed: boolean;
	showTooltip: boolean;
};

export type SidebarLinksProps = {
	isCollapsed: boolean;
	pathname: string;
	assetsReady: boolean;
	showTooltip: boolean;
	onNavigate: (route: RouteValue) => void;
};

export type SidebarBadgeProps = {
	count: number;
	label: string;
};
