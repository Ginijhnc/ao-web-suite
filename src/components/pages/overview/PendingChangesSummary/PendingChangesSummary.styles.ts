import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const cardStyle = css`
	background-color: ${theme.palette.background.paper};
	text-align: center;
	border-radius: 1em;
	padding: 1.5rem;

	p {
		color: ${theme.palette.text.secondary};
	}
`;

export const titleStyle = css`
	text-transform: uppercase;
	text-align: center;
	letter-spacing: 0.08em;
	color: ${theme.palette.text.secondary};
	margin-bottom: 0.75rem;
`;
