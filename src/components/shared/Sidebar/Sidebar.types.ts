import type { IconProps } from '@Components/icons';
import type { RouteTitleValue, RouteValue } from '@Constants/routes';

export type SidebarInternalLink = {
	label: RouteTitleValue;
	route: RouteValue;
	icon: (props: IconProps) => React.ReactElement;
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
	onNavigate: (route: RouteValue) => void;
};

export type SidebarExternalLinkItemProps = {
	link: SidebarExternalLink;
	isCollapsed: boolean;
};

export type SidebarLinksProps = {
	isCollapsed: boolean;
	pathname: string;
	onNavigate: (route: RouteValue) => void;
};
