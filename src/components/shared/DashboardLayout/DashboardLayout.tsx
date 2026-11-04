import { useState } from 'react';
import { Sidebar } from '@Components/shared/Sidebar';
import { ROUTES } from '@Constants/routes';
import { useLocation } from 'react-router';
import { dashboardStyle, mainStyle } from './DashboardLayout.styles';
import type { DashboardLayoutProps } from './DashboardLayout.types';

export const DashboardLayout = ({
	children,
}: DashboardLayoutProps): React.ReactElement => {
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const location = useLocation();
	const [lastPathname, setLastPathname] = useState(location.pathname);

	// Close the mobile menu after route changes.
	if (location.pathname !== lastPathname) {
		setLastPathname(location.pathname);
		setIsMobileOpen(false);
	}

	if (location.pathname === ROUTES.ROOT) {
		return <>{children}</>;
	}

	return (
		<div className={dashboardStyle}>
			<Sidebar
				isMobileOpen={isMobileOpen}
				isCollapsed={isCollapsed}
				onAfterNavigation={() => {
					setIsMobileOpen(false);
				}}
				onToggleMobile={() => {
					setIsMobileOpen((prev) => {
						return !prev;
					});
				}}
				onToggleCollapse={() => {
					setIsCollapsed((prev) => {
						return !prev;
					});
				}}
			/>
			<main className={mainStyle}>{children}</main>
		</div>
	);
};
