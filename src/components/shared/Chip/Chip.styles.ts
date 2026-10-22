import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const chipStyle = css`
	display: inline-flex;
	align-items: center;
	gap: 0.4em;
	border: none;
	border-radius: 2em;
	padding: 0.5em 1.1em;
	background-color: hsl(0, 5%, 14%);
	color: ${theme.palette.text.secondary};
	cursor: pointer;
	font-size: 0.95rem;
	transition:
		background-color 0.2s,
		color 0.2s;

	svg {
		width: 1.2em;
		height: 1.2em;
		fill: ${theme.palette.text.secondary};
	}

	&:hover {
		background-color: hsl(0, 5%, 22%);
	}

	&[aria-pressed='true'] {
		background-color: hsl(0, 5%, 18%);
	}
`;
