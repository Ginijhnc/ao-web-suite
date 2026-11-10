import { ROUTES } from '@Constants/routes';
import { useAssetsReady } from '@Hooks/useAssetsReady';
import { useHydrated } from '@Hooks/useHydrateStores';
import { Navigate, Outlet } from 'react-router';

/**
 * Renders children only when IDB hydration is complete and all asset
 * stores are populated. Otherwise redirects to the root route.
 */
export const RequireAssets = (): React.ReactElement => {
	const hydrated = useHydrated();
	const assetsReady = useAssetsReady();

	if (!hydrated) {
		return <></>;
	}

	if (!assetsReady) {
		return <Navigate to={ROUTES.RECURSOS} replace />;
	}

	return <Outlet />;
};
