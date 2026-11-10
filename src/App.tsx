import { ToastContainer } from '@Components/shared/ToastContainer';
import { LoadingOverlayProvider } from '@Contexts/LoadingOverlayContext';
import { useHydrateStores } from '@Hooks/useHydrateStores';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import '@SharedStyles/App.css';
import theme from '@Theme/theme';
import { RouterProvider } from 'react-router';
import { router } from './routes';

export const App = (): React.ReactElement => {
	useHydrateStores();

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer />
				<LoadingOverlayProvider>
					<RouterProvider router={router} />
				</LoadingOverlayProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
