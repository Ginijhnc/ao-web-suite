import { createContext, useContext, useState } from 'react';
import { LoadingOverlay } from '@Components/shared/LoadingOverlay';

type LoadingOverlayContextValue = {
	showLoader: () => void;
	hideLoader: () => void;
};

const LoadingOverlayContext =
	createContext<LoadingOverlayContextValue | null>(null);

export const LoadingOverlayProvider = ({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement => {
	const [visible, setVisible] = useState(false);

	const showLoader = (): void => {
		setVisible(true);
	};

	const hideLoader = (): void => {
		setVisible(false);
	};

	return (
		<LoadingOverlayContext value={{ showLoader, hideLoader }}>
			{children}
			<LoadingOverlay visible={visible} />
		</LoadingOverlayContext>
	);
};

export const useLoadingOverlay = (): LoadingOverlayContextValue => {
	const context = useContext(LoadingOverlayContext);
	if (!context) {
		throw new Error(
			'useLoadingOverlay debe usarse dentro de LoadingOverlayProvider',
		);
	}
	return context;
};
