import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { HomePage } from '@Pages/HomePage';
import '@SharedStyles/App.css';
import theme from '@Theme/theme';

export const App = (): React.ReactElement => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<HomePage />
			</ThemeProvider>
		</StyledEngineProvider>
	);
};
