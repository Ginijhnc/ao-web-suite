import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const barStyle = css`
	display: flex;
	gap: 1.5rem;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	background-color: ${theme.palette.background.paper};
	border-radius: 1em;
	padding: 1.5rem 1rem;
	margin-bottom: 1rem;

	@media (min-width: ${theme.breakpoints.values.md}em) {
		justify-content: space-between;
	}
`;

export const chipsGroupStyle = css`
	display: flex;
	gap: 0.5rem;
	align-items: center;

	@media (min-width: ${theme.breakpoints.values.md}em) {
		flex: 1;
	}
`;

export const searchFieldStyle = css`
	width: 17rem;
	flex-shrink: 0;
`;
