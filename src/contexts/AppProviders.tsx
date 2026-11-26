import { LoadingOverlayProvider } from '@Contexts/LoadingOverlayContext';
import { UploadStatusProvider } from '@Contexts/UploadStatusContext';
import { RouterProvider } from 'react-router';
import { router } from '../routes';

export const AppProviders = (): React.ReactElement => {
	return (
		<LoadingOverlayProvider>
			<UploadStatusProvider>
				<RouterProvider router={router} />
			</UploadStatusProvider>
		</LoadingOverlayProvider>
	);
};
