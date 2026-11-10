import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const cardStyle = css`
	background-color: ${theme.palette.background.paper};
	text-align: center;
	border-radius: 1em;
	padding: 1.5rem;
`;

export const titleStyle = css`
	text-transform: uppercase;
	text-align: center;
	letter-spacing: 0.08em;
	color: ${theme.palette.text.secondary};
	margin-bottom: 0.75rem;
`;

export const emptyStateStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 2.5rem 0;

	span {
		color: ${theme.palette.text.secondary};
	}

	svg {
		width: 3rem;
		height: 3rem;
		opacity: 0.4;
	}
`;
