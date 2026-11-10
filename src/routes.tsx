import { lazy } from 'react';
import { LoadingOverlay } from '@Components/shared/LoadingOverlay';
import { RequireAssets } from '@Components/shared/RequireAssets';
import { ROUTES } from '@Constants/routes';
import { useAssetsReady } from '@Hooks/useAssetsReady';
import { useDelayedFlag } from '@Hooks/useDelayedFlag';
import { useHydrated } from '@Hooks/useHydrateStores';
import { HomePage } from '@Pages/HomePage';
import { Navigate } from 'react-router';
import type { RouteObject } from 'react-router';

const OverviewPage = lazy(async () => {
	const module = await import('@Pages/OverviewPage');
	return { default: module.OverviewPage };
});

const LogsPage = lazy(async () => {
	const module = await import('@Pages/LogsPage');
	return { default: module.LogsPage };
});

const HYDRATION_OVERLAY_DELAY_MS = 300;

/**
 * Redirects `/` to `/panel` or `/recursos` after hydration. Complements
 * `RequireAssets`, which handles the inverse: direct access to asset-gated
 * routes without assets loaded.
 */
const RootRedirect = (): React.ReactElement => {
	const hydrated = useHydrated();
	const assetsReady = useAssetsReady();
	const showOverlay = useDelayedFlag(HYDRATION_OVERLAY_DELAY_MS);

	if (!hydrated) {
		return <LoadingOverlay visible={showOverlay} />;
	}

	return (
		<Navigate
			to={assetsReady ? ROUTES.OVERVIEW : ROUTES.RECURSOS}
			replace
		/>
	);
};

export const routeConfig: Array<RouteObject> = [
	{
		path: '/',
		element: <RootRedirect />,
	},
	{
		path: ROUTES.RECURSOS,
		element: <HomePage />,
	},
	{
		path: ROUTES.OVERVIEW,
		element: (
			<RequireAssets>
				<OverviewPage />
			</RequireAssets>
		),
	},
	{ path: ROUTES.LOGS, element: <LogsPage /> },
];
