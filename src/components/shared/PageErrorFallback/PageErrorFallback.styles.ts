import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const containerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	min-height: 100vh;
	padding: 3rem 2rem;
	text-align: center;

	p {
		color: ${theme.palette.text.secondary};
	}
`;

export const iconStyle = css`
	opacity: 0.4;

	svg {
		width: 4rem;
		height: 4rem;
	}
`;
