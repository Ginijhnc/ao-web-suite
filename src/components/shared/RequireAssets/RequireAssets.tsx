import { DAT_NAMES } from '@Constants/dats';
import { INDICES_NAMES } from '@Constants/indices';
import { ROUTES } from '@Constants/routes';
import { useHydrated } from '@Hooks/useHydrateStores';
import { useDats } from '@Stores/datsStore';
import { useGraphicsFiles } from '@Stores/graphicsStore';
import { useIndices } from '@Stores/indicesStore';
import { Navigate } from 'react-router';
import type { RequireAssetsProps } from './RequireAssets.types';

/**
 * Renders children only when IDB hydration is complete and all asset
 * stores are populated. Otherwise redirects to the root route.
 */
export const RequireAssets = ({
	children,
}: RequireAssetsProps): React.ReactElement => {
	const hydrated = useHydrated();
	const graphics = useGraphicsFiles();
	const dats = useDats();
	const indices = useIndices();

	const assetsReady =
		graphics.length > 0 &&
		dats.size === Object.values(DAT_NAMES).length &&
		indices.size === Object.values(INDICES_NAMES).length;

	if (!hydrated) {
		return <></>;
	}

	if (!assetsReady) {
		return <Navigate to={ROUTES.ROOT} replace />;
	}

	return <>{children}</>;
};
