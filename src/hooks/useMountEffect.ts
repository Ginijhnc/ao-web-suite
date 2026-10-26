import { useEffect } from 'react';

/**
 * Runs a callback once on mount. Restricted to syncing with external
 * systems (IndexedDB, localStorage, third-party widgets) where a
 * one-time side effect on mount is the correct pattern.
 */
export const useMountEffect = (callback: () => void): void => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);
};
