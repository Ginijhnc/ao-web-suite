import { Toaster } from 'react-hot-toast';
import { toastBaseStyle } from './ToastContainer.styles';

export const ToastContainer = (): React.ReactElement => {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				className: toastBaseStyle,
				duration: 4000,
			}}
		/>
	);
};
