import { ToastContainer } from '@Components/shared/ToastContainer';
import { LoadingOverlayProvider } from '@Contexts/LoadingOverlayContext';
import { useHydrateStores } from '@Hooks/useHydrateStores';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import '@SharedStyles/App.css';
import theme from '@Theme/theme';
import { BrowserRouter, useRoutes } from 'react-router';
import { routeConfig } from './routes';

const AppRoutes = (): React.ReactElement | null => {
	return useRoutes(routeConfig);
};

export const App = (): React.ReactElement => {
	useHydrateStores();

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer />
				<LoadingOverlayProvider>
					<BrowserRouter>
						<AppRoutes />
					</BrowserRouter>
				</LoadingOverlayProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
