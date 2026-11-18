import { useEffect, type EffectCallback } from 'react';

/**
 * Runs an effect once on mount. The effect may return a cleanup function
 * that runs on unmount. Restricted to syncing with external systems
 * (IndexedDB, localStorage, third-party widgets). Signals intent: this runs
 * once for external system setup/teardown. It also hardcodes an empty dependency
 * array to prevent accidental dependencies that would defeat the mount-once
 * pattern.
 */
export const useMountEffect = (effect: EffectCallback): void => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(effect, []);
};
