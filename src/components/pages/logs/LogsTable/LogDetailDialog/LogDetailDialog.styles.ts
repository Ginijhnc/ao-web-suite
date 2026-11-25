import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const metaRowStyle = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
`;

export const dateTextStyle = css`
	color: ${theme.palette.neutral.secondary};
`;
