import { isFirefox } from '@Utils/browser';
import { useNavigate } from 'react-router';
import type { NavigateOptions, To } from 'react-router';

type AppNavigateFunction = (to: To, options?: NavigateOptions) => void;

export const useAppNavigate = (): AppNavigateFunction => {
	const navigate = useNavigate();

	return (to, options) => {
		void navigate(to, { ...options, viewTransition: !isFirefox() });
	};
};
