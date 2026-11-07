import { css } from '@emotion/css';
import { alpha } from '@mui/material/styles';
import theme from '@Theme/theme';

export const containerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 3rem 2rem;
	background-color: ${alpha(theme.palette.secondary.main, 0.3)};
	border: 1px solid ${theme.palette.divider};
	border-radius: 0.5em;

	// title and subtitle
	p {
		color: ${theme.palette.text.secondary};
		text-align: center;
	}
`;

export const iconStyle = css`
	opacity: 0.4;

	svg {
		width: 4rem;
		height: 4rem;
	}
`;
