import { ToastContainer } from '@Components/shared/ToastContainer';
import { AppProviders } from '@Contexts/AppProviders';
import { useHydrateStores } from '@Hooks/useHydrateStores';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import '@SharedStyles/App.css';
import theme from '@Theme/theme';

export const App = (): React.ReactElement => {
	useHydrateStores();

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer />
				<AppProviders />
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
