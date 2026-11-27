import { GENERAL_SELECTORS } from '@Constants/selectors';
import { Toaster, ToastBar } from 'react-hot-toast';
import {
	toastBaseStyle,
	toastTransitionStyle,
} from './ToastContainer.styles';

export const ToastContainer = (): React.ReactElement => {
	return (
		<div data-testid={GENERAL_SELECTORS.TOAST}>
			<Toaster
				position="top-right"
				toastOptions={{
					className: toastBaseStyle,
					duration: 4000,
				}}
			>
				{(toast) => {
					return (
						<div className={toastTransitionStyle(toast.id)}>
							<ToastBar toast={toast} />
						</div>
					);
				}}
			</Toaster>
		</div>
	);
};
