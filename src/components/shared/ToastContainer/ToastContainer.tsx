import { GENERAL_SELECTORS } from '@Constants/selectors';
import { Toaster } from 'react-hot-toast';
import { toastBaseStyle } from './ToastContainer.styles';

export const ToastContainer = (): React.ReactElement => {
	return (
		<div data-testid={GENERAL_SELECTORS.TOAST}>
			<Toaster
				position="top-right"
				toastOptions={{
					className: toastBaseStyle,
					duration: 4000,
				}}
			/>
		</div>
	);
};
