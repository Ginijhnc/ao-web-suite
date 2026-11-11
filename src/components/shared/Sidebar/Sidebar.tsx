import { ChevronLeftIcon, CloseIcon, MenuIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import { Tooltip, loadMuiTooltip } from '@Components/shared/Tooltip';
import { useAssetsReady } from '@Hooks/useAssetsReady';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLogCount } from '@Stores/logStore';
import { useLocation, useNavigate } from 'react-router';
import {
	SIDEBAR_BADGE_KEYS,
	SIDEBAR_EXTERNAL_LINKS,
	SIDEBAR_INTERNAL_LINKS,
} from './Sidebar.constants';
import {
	collapseButtonStyle,
	linkActiveStyle,
	linkContentStyle,
	linkDisabledTooltipWrapperStyle,
	linkIconStyle,
	linkStyle,
	linkTextStyle,
	mobileDrawerToggleStyle,
	sidebarBadgeStyle,
	sidebarCollapsedStyle,
	sidebarLinksStyle,
	sidebarLinksCollapsedStyle,
	linkDisabledStyle,
	sidebarNavItemCollapsedStyle,
	sidebarNavItemStyle,
	sidebarStyle,
} from './Sidebar.styles';
import type {
	SidebarBadgeProps,
	SidebarDesktopCollapseButtonProps,
	SidebarExternalLinkItemProps,
	SidebarInternalLinkItemProps,
	SidebarLinksProps,
	SidebarMobileDrawerToggleProps,
	SidebarProps,
} from './Sidebar.types';

const SidebarMobileDrawerToggle = ({
	isMobileOpen,
	onToggleMobile,
}: SidebarMobileDrawerToggleProps): React.ReactElement => {
	return (
		<button
			type="button"
			className={mobileDrawerToggleStyle}
			onClick={onToggleMobile}
			aria-label={isMobileOpen ? 'Expandir menú' : 'Contraer menú'}
			aria-expanded={isMobileOpen}
		>
			{isMobileOpen ? <CloseIcon /> : <MenuIcon />}
		</button>
	);
};

const SidebarDesktopCollapseButton = ({
	isCollapsed,
	onToggleCollapse,
}: SidebarDesktopCollapseButtonProps): React.ReactElement => {
	const handlePointerEnter = (): void => {
		void loadMuiTooltip();
	};

	return (
		<button
			type="button"
			className={collapseButtonStyle}
			onClick={onToggleCollapse}
			onPointerEnter={isCollapsed ? undefined : handlePointerEnter}
			aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
		>
			<div className={linkIconStyle}>
				{isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
			</div>
		</button>
	);
};

const SidebarBadge = ({
	count,
	label,
}: SidebarBadgeProps): React.ReactElement | null => {
	if (count === 0) return null;

	return (
		<Text
			renderAs="span"
			size="xs"
			weight="semiBold"
			className={sidebarBadgeStyle}
		>
			{label}
		</Text>
	);
};

const SidebarInternalLinkItem = ({
	link,
	isActive,
	isCollapsed,
	isDisabled,
	showTooltip,
	badge,
	onNavigate,
}: SidebarInternalLinkItemProps): React.ReactElement => {
	const Icon = link.icon;
	const navItemClassName = [
		linkStyle,
		sidebarNavItemStyle,
		isCollapsed ? sidebarNavItemCollapsedStyle : undefined,
		isActive ? linkActiveStyle : undefined,
		isDisabled ? linkDisabledStyle : undefined,
	]
		.filter(Boolean)
		.join(' ');

	const button = (
		<button
			type="button"
			className={navItemClassName}
			disabled={isDisabled}
			aria-disabled={isDisabled}
			onClick={() => {
				onNavigate(link.route);
			}}
		>
			<div className={linkContentStyle}>
				<div className={linkIconStyle}>
					<Icon />
				</div>
				<Text
					renderAs="span"
					variant="body"
					className={linkTextStyle}
				>
					{link.label}
				</Text>
				{badge}
			</div>
		</button>
	);

	if (!showTooltip) {
		return button;
	}

	return (
		<Tooltip title={link.label} placement="right">
			{isDisabled ? (
				<span className={linkDisabledTooltipWrapperStyle}>
					{button}
				</span>
			) : (
				button
			)}
		</Tooltip>
	);
};

const SidebarExternalLinkItem = ({
	link,
	isCollapsed,
	showTooltip,
}: SidebarExternalLinkItemProps): React.ReactElement => {
	const Icon = link.icon;
	const externalLinkClassName = [
		linkStyle,
		sidebarNavItemStyle,
		isCollapsed ? sidebarNavItemCollapsedStyle : undefined,
	]
		.filter(Boolean)
		.join(' ');

	const anchor = (
		<a
			href={link.href}
			target="_blank"
			rel="noopener noreferrer"
			className={externalLinkClassName}
		>
			<div className={linkContentStyle}>
				<div className={linkIconStyle}>
					<Icon />
				</div>
				<Text
					renderAs="span"
					variant="body"
					className={linkTextStyle}
				>
					{link.label}
				</Text>
			</div>
		</a>
	);

	if (!showTooltip) {
		return anchor;
	}

	return (
		<Tooltip title={link.label} placement="right">
			{anchor}
		</Tooltip>
	);
};

const SidebarLinks = ({
	isCollapsed,
	pathname,
	assetsReady,
	showTooltip,
	onNavigate,
}: SidebarLinksProps): React.ReactElement => {
	const logCount = useLogCount();
	const logCountLabel = logCount > 99 ? '99+' : String(logCount);

	const badgeMap: Record<string, React.ReactNode> = {
		[SIDEBAR_BADGE_KEYS.LOGS]: (
			<SidebarBadge count={logCount} label={logCountLabel} />
		),
	};

	const linksClassName = [
		sidebarLinksStyle,
		isCollapsed ? sidebarLinksCollapsedStyle : undefined,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={linksClassName}>
			{SIDEBAR_INTERNAL_LINKS.map((link) => {
				const isDisabled =
					link.disabled || (link.requiresAssets && !assetsReady);
				const badge = link.badgeKey
					? badgeMap[link.badgeKey]
					: undefined;

				return (
					<SidebarInternalLinkItem
						key={link.route}
						link={link}
						isActive={pathname === link.route}
						isCollapsed={isCollapsed}
						isDisabled={isDisabled}
						showTooltip={showTooltip}
						badge={badge}
						onNavigate={onNavigate}
					/>
				);
			})}
			{SIDEBAR_EXTERNAL_LINKS.map((link) => {
				return (
					<SidebarExternalLinkItem
						key={link.href}
						link={link}
						isCollapsed={isCollapsed}
						showTooltip={showTooltip}
					/>
				);
			})}
		</div>
	);
};

export const Sidebar = ({
	isMobileOpen,
	isCollapsed,
	onAfterNavigation,
	onToggleMobile,
	onToggleCollapse,
}: SidebarProps): React.ReactElement => {
	const navigate = useNavigate();
	const location = useLocation();
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const assetsReady = useAssetsReady();
	const showTooltip = isDesktop && isCollapsed;

	const handleNavigate: SidebarLinksProps['onNavigate'] = (route) => {
		void navigate(route);
		onAfterNavigation();
	};

	const sidebarPaperClassName = [
		sidebarStyle,
		isCollapsed ? sidebarCollapsedStyle : undefined,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<>
			<SidebarMobileDrawerToggle
				isMobileOpen={isMobileOpen}
				onToggleMobile={onToggleMobile}
			/>
			<Drawer
				variant={isDesktop ? 'permanent' : 'temporary'}
				open={isDesktop ? true : isMobileOpen}
				onClose={onAfterNavigation}
				slotProps={{
					paper: {
						className: sidebarPaperClassName,
						component: 'nav',
						'aria-label': 'Navegación principal',
					},
				}}
				ModalProps={{ keepMounted: true }}
			>
				<SidebarDesktopCollapseButton
					isCollapsed={isCollapsed}
					onToggleCollapse={onToggleCollapse}
				/>
				<SidebarLinks
					isCollapsed={isCollapsed}
					pathname={location.pathname}
					assetsReady={assetsReady}
					showTooltip={showTooltip}
					onNavigate={handleNavigate}
				/>
			</Drawer>
		</>
	);
};
