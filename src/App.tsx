import { RequireAssets } from '@Components/shared/RequireAssets';
import { ToastContainer } from '@Components/shared/ToastContainer';
import { ROUTES } from '@Constants/routes';
import { LoadingOverlayProvider } from '@Contexts/LoadingOverlayContext';
import { useHydrateStores } from '@Hooks/useHydrateStores';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { HomePage } from '@Pages/HomePage';
import { OverviewPage } from '@Pages/OverviewPage';
import '@SharedStyles/App.css';
import theme from '@Theme/theme';
import { BrowserRouter, Route, Routes } from 'react-router';

export const App = (): React.ReactElement => {
	useHydrateStores();

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer />
				<LoadingOverlayProvider>
					<BrowserRouter>
						<Routes>
							{/* TO DO - Pendiente: refactorizar esto en otro PR */}
							<Route
								path={ROUTES.ROOT}
								element={<HomePage />}
							/>
							<Route
								path={ROUTES.OVERVIEW}
								element={
									<RequireAssets>
										<OverviewPage />
									</RequireAssets>
								}
							/>
						</Routes>
					</BrowserRouter>
				</LoadingOverlayProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
