import { css } from '@emotion/css';
import { BREAKPOINTS } from '@Theme/theme';
import type { ContainerMaxWidth } from './Container.types';

export const baseContainerStyle = css`
	max-width: 100%;
	margin: 0 auto;
	padding: 1rem 1rem 0 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const maxWidthStyles: Record<ContainerMaxWidth, string> = {
	sm: css`
		max-width: ${BREAKPOINTS.sm}em;
	`,
	md: css`
		max-width: ${BREAKPOINTS.md}em;
	`,
	lg: css`
		max-width: ${BREAKPOINTS.lg}em;
	`,
	xl: css`
		max-width: ${BREAKPOINTS.xl}em;
	`,
	xl2: css`
		max-width: ${BREAKPOINTS.xl2}em;
	`,
};
