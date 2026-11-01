import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const infoPanelStyle = css`
	background-color: hsl(25, 20%, 10%, 30%);
	border-radius: 0.5em;
	padding: 0.75em 1em;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.35rem;
`;

export const fileListStyle = css`
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.25rem 1rem;
`;

export const fileRowStyle = css`
	display: flex;
	align-items: center;
	gap: 0.4em;
	color: ${theme.palette.text.secondary};

	svg {
		fill: currentColor;
		width: 1em;
		height: 1em;
	}
`;
