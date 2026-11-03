import { css } from '@emotion/css';
import { BREAKPOINTS } from '@Theme/theme';

export const contentStyle = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
	max-width: 60rem;
	gap: 1.5rem;
	margin: 2rem 0;
`;

export const summaryRowStyle = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.5rem;

	@media (min-width: ${BREAKPOINTS.md}em) {
		grid-template-columns: 1fr 1fr;
	}
`;
