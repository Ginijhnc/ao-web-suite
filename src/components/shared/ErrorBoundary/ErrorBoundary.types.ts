import type { ReactNode } from 'react';

export type ErrorBoundaryFallbackParams = {
	error: Error;
	reset: () => void;
};

export type ErrorBoundaryProps = {
	children: ReactNode;
	/**
	 * Rendered when a descendant throws during render. Receives the error
	 * and a `reset` callback that clears the boundary and re-renders the
	 * children (in-place recovery, no full reload).
	 */
	fallback: (params: ErrorBoundaryFallbackParams) => ReactNode;
	/** Side-effect hook (e.g. logging). */
	onError?: (error: Error) => void;
};

export type ErrorBoundaryState = {
	error: Error | null;
};
