import { Component } from 'react';
import { log } from '@Utils/logger';
import type {
	ErrorBoundaryProps,
	ErrorBoundaryState,
} from './ErrorBoundary.types';

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError = (
		error: Error,
	): ErrorBoundaryState => {
		return { error };
	};

	componentDidCatch = (
		error: Error,
		errorInfo: React.ErrorInfo,
	): void => {
		this.props.onError?.(error);
		log.error(error, errorInfo.componentStack);
	};

	handleReset = (): void => {
		this.setState({ error: null });
	};

	render = (): ErrorBoundaryProps['children'] => {
		const { error } = this.state;
		if (error) {
			return this.props.fallback({ error, reset: this.handleReset });
		}
		return this.props.children;
	};
}
