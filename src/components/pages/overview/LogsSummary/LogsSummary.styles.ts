import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const cardStyle = css`
	background-color: ${theme.palette.background.paper};
	border-radius: 1em;
	padding: 1.5rem;
`;

export const headerRowStyle = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
`;

export const titleStyle = css`
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: ${theme.palette.text.secondary};
`;

export const entryStyle = css`
	display: flex;
	align-items: center;
	gap: 2rem;
	padding: 0.4rem 0;
	border-top: 1px solid hsl(0, 0%, 16%);
`;

export const levelBadgeBaseStyle = css`
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	min-width: 3.5em;
	text-align: center;
`;

export const levelErrorStyle = css`
	color: ${theme.palette.error.main};
`;

export const levelWarnStyle = css`
	color: ${theme.palette.warning.main};
`;

export const timestampStyle = css`
	color: hsl(0, 0%, 45%);
	font-size: 0.8rem;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
`;

export const messageStyle = css`
	color: ${theme.palette.text.secondary};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
`;

export const emptyStyle = css`
	color: ${theme.palette.text.secondary};
`;
