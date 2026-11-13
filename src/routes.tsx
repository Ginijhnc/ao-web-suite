import { Suspense } from 'react';
import { DashboardLayout } from '@Components/shared/DashboardLayout';
import { LoadingOverlay } from '@Components/shared/LoadingOverlay';
import { NavigationProgressBar } from '@Components/shared/NavigationProgressBar';
import { PageErrorFallback } from '@Components/shared/PageErrorFallback';
import { RequireAssets } from '@Components/shared/RequireAssets';
import { ROUTES } from '@Constants/routes';
import { useAssetsReady } from '@Hooks/useAssetsReady';
import { useDelayedFlag } from '@Hooks/useDelayedFlag';
import { useHydrated } from '@Hooks/useHydrateStores';
import { HomePage } from '@Pages/HomePage';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';

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

const RootLayout = (): React.ReactElement => {
	return (
		<>
			<NavigationProgressBar />
			<DashboardLayout>
				<Suspense fallback={<LoadingOverlay visible />}>
					<Outlet />
				</Suspense>
			</DashboardLayout>
		</>
	);
};

export const router = createBrowserRouter([
	{
		element: <RootLayout />,
		errorElement: <PageErrorFallback />,
		children: [
			{ path: '/', element: <RootRedirect /> },
			{ path: ROUTES.RECURSOS, element: <HomePage /> },
			{
				path: ROUTES.OVERVIEW,
				element: <RequireAssets />,
				children: [
					{
						index: true,
						lazy: async () => {
							const { OverviewPage } =
								await import('@Pages/OverviewPage');
							return { Component: OverviewPage };
						},
					},
				],
			},
			{
				path: ROUTES.LOGS,
				lazy: async () => {
					const { LogsPage } = await import('@Pages/LogsPage');
					return { Component: LogsPage };
				},
			},
			// temporal hasta que termine de agregar todas las páginas
			{ path: '*', element: null },
		],
	},
]);
