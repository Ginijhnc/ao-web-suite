import { useEffect, useState } from 'react';

/**
 * Returns `false` until `delayMs` milliseconds have elapsed, then
 * flips to `true`. Useful for preventing loading indicators from
 * flashing on fast operations, for example only showing the
 * `LoadingOverlay` component if hydration takes longer than the
 *  threshold.
 */
export const useDelayedFlag = (delayMs: number): boolean => {
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		const id = setTimeout(() => {
			setFlag(true);
		}, delayMs);

		return () => {
			clearTimeout(id);
		};
	}, [delayMs]);

	return flag;
};
