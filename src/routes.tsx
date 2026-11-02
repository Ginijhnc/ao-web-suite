import { RequireAssets } from '@Components/shared/RequireAssets';
import { ROUTES } from '@Constants/routes';
import { HomePage } from '@Pages/HomePage';
import { OverviewPage } from '@Pages/OverviewPage';
import type { RouteObject } from 'react-router';

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
];
