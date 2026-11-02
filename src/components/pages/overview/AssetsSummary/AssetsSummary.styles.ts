import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const cardStyle = css`
	background-color: ${theme.palette.background.paper};
	border-radius: 1em;
	padding: 1.5rem;
`;

export const titleStyle = css`
	text-align: center;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 1rem;
	color: ${theme.palette.text.secondary};
`;

export const gridStyle = css`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.75rem 2rem;
`;

export const statRowStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;

	// asset name label
	span:nth-of-type(1) {
		color: ${theme.palette.text.secondary};
	}

	// numeric count, right-aligned
	span:nth-of-type(2) {
		font-variant-numeric: tabular-nums;
		color: ${theme.palette.text.primary};
	}
`;
