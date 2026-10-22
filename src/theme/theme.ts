import brownBackgroundTexture from '@Assets/images/textures/brown_background_texture.png';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
	interface ButtonPropsVariantOverrides {
		primary: true;
		secondary: true;
	}
}

declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		xs: false;
		xl2: true;
	}
}

// em values. px equivalents assume 16px base font size
export const BREAKPOINTS = {
	sm: 40, // 640px
	md: 48, // 768px
	lg: 64, // 1024px
	xl: 80, // 1280px
	xl2: 96, // 1536px
} as const;

const theme = createTheme({
	palette: {
		primary: {
			main: 'hsl(0, 0%, 14%)',
		},
		secondary: {
			main: 'hsl(0, 0%, 9%)',
		},
		text: {
			primary: 'hsl(0, 0%, 88%)',
			secondary: 'hsl(40, 5%, 70%)',
		},
		success: {
			main: 'hsl(145, 50%, 32%)',
		},
		error: {
			main: 'hsl(357, 75%, 58%)',
		},
		warning: {
			main: 'hsl(36, 90%, 55%)',
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundImage: `url(${brownBackgroundTexture})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundAttachment: 'fixed',
				},
			},
		},
	},
	breakpoints: {
		values: BREAKPOINTS,
	},
});

export default theme;
