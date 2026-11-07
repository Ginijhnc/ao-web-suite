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
		background: {
			paper: 'hsl(25, 20%, 12%, 20%)',
			default: 'hsl(18, 22%, 9%)',
		},
		divider: 'hsl(18, 17%, 12%)',
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
		MuiTextField: {
			styleOverrides: {
				root: ({ theme: t }) => {
					return {
						'& .MuiInputBase-root': {
							backgroundColor: 'hsl(0, 5%, 10%)',
							borderRadius: '0.5em',
							fontSize: '0.875rem',
							color: t.palette.text.secondary,
						},
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: 'hsl(0, 5%, 22%)',
							transition: 'border-color 0.2s',
						},
						'& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
							{
								borderColor: 'hsl(0, 5%, 38%)',
							},
						'& .Mui-focused .MuiOutlinedInput-notchedOutline':
							{
								borderColor: 'hsl(0, 5%, 50%)',
								borderWidth: '1px',
							},
						'& input::placeholder': {
							color: t.palette.text.secondary,
							opacity: 0.5,
						},
						'& .MuiInputAdornment-root svg': {
							fill: t.palette.text.secondary,
							width: '1.3em',
							height: '1.3em',
						},
					};
				},
			},
		},
	},
	breakpoints: {
		values: BREAKPOINTS,
	},
});

export default theme;
