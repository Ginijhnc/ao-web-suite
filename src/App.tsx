import { Suspense } from 'react';
import { DashboardLayout } from '@Components/shared/DashboardLayout';
import { LoadingOverlay } from '@Components/shared/LoadingOverlay';
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
						<DashboardLayout>
							<Suspense
								fallback={<LoadingOverlay visible />}
							>
								<AppRoutes />
							</Suspense>
						</DashboardLayout>
					</BrowserRouter>
				</LoadingOverlayProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
