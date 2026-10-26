import { ToastContainer } from '@Components/shared/ToastContainer';
import { LoadingOverlayProvider } from '@Contexts/LoadingOverlayContext';
import { useHydrateStores } from '@Hooks/useHydrateStores';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { HomePage } from '@Pages/HomePage';
import '@SharedStyles/App.css';
import theme from '@Theme/theme';

export const App = (): React.ReactElement => {
	useHydrateStores();

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer />
				<LoadingOverlayProvider>
					<HomePage />
				</LoadingOverlayProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
