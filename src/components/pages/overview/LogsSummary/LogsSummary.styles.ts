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
	flex-wrap: wrap;
	align-items: center;
	gap: 0.35rem 2rem;
	padding: 0.7rem 0;
	border-top: 1px solid hsl(0, 0%, 16%);

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		flex-wrap: nowrap;
	}
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
	flex-basis: 100%;
	text-align: left;

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		flex-basis: auto;
		margin-left: 0;
	}
`;

export const messageStyle = css`
	color: ${theme.palette.text.secondary};
	flex-basis: 100%;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	text-align: left;

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		flex: 1;
		flex-basis: auto;
		min-width: 0;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const emptyStyle = css`
	color: ${theme.palette.text.secondary};
`;
