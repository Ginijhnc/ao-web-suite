import { DAT_NAMES } from '@Constants/dats';
import { INDICES_NAMES } from '@Constants/indices';
import { useDats } from '@Stores/datsStore';
import { useGraphicsFiles } from '@Stores/graphicsStore';
import { useIndices } from '@Stores/indicesStore';
import { useHydrated } from './useHydrateStores';

/**
 * Returns true once IDB hydration is complete and all required asset
 * stores (graphics, dats, indices) are fully populated.
 */
export const useAssetsReady = (): boolean => {
	const hydrated = useHydrated();
	const graphics = useGraphicsFiles();
	const dats = useDats();
	const indices = useIndices();

	return (
		hydrated &&
		graphics.length > 0 &&
		dats.size === Object.values(DAT_NAMES).length &&
		indices.size === Object.values(INDICES_NAMES).length
	);
};
