import { lazy } from 'react';
import { RequireAssets } from '@Components/shared/RequireAssets';
import { ROUTES } from '@Constants/routes';
import { HomePage } from '@Pages/HomePage';
import type { RouteObject } from 'react-router';

const OverviewPage = lazy(async () => {
	const module = await import('@Pages/OverviewPage');
	return { default: module.OverviewPage };
});

const LogsPage = lazy(async () => {
	const module = await import('@Pages/LogsPage');
	return { default: module.LogsPage };
});

export const routeConfig: Array<RouteObject> = [
	{
		path: ROUTES.ROOT,
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
