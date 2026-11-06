import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const paginationStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 0;

	& > span {
		color: ${theme.palette.text.secondary};
	}

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
	}
`;

export const paginationItemStyle = css`
	.MuiTouchRipple-root {
		display: none;
	}

	color: ${theme.palette.text.secondary};
	border-color: hsl(0, 5%, 22%);
	background-color: hsl(0, 5%, 14%);
	font-size: 0.875rem;
	transition:
		background-color 0.2s,
		color 0.2s;

	&:hover {
		background-color: hsl(0, 5%, 22%);
		color: ${theme.palette.text.primary};
	}

	&.Mui-selected {
		background-color: hsl(0, 5%, 28%);
		border-color: hsl(0, 5%, 28%);
		color: ${theme.palette.text.primary};

		&:hover {
			background-color: hsl(0, 5%, 33%);
		}
	}

	&.Mui-disabled {
		opacity: 0.3;
	}

	&.MuiPaginationItem-ellipsis {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 32px;
		background-color: transparent;
		border-color: transparent;
		cursor: default;

		&:hover {
			background-color: transparent;
			color: ${theme.palette.text.secondary};
		}
	}
`;

export const tableContainerStyle = css`
	@media (min-width: ${theme.breakpoints.values.sm}em) {
		min-height: 47rem;
	}
`;

export const sortButtonStyle = css`
	display: inline-flex;
	align-items: center;
	gap: 0.25em;
	background: none;
	border: none;
	cursor: pointer;
	color: inherit;
	font: inherit;
	padding: 0;

	svg {
		width: 1.5em;
		height: 1.5em;
		opacity: 0.6;
	}
`;

export const tableStyle = css`
	width: 100%;
	table-layout: fixed;

	thead {
		display: none;

		& tr {
			background-color: hsl(25 20% 12% / 0.6);
		}

		& td,
		& th {
			vertical-align: middle;
			border-bottom: 1px solid ${theme.palette.primary.main};
		}
	}

	tbody {
		& tr {
			position: relative;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			height: auto;
			gap: 0.35rem;
			padding: 1rem 2.5rem 1rem 1rem;
			border-top: 1px solid ${theme.palette.divider};
		}

		& tr:nth-child(odd) {
			background-color: hsl(18 8% 9% / 0.5);
		}

		& tr:nth-child(even) {
			background-color: hsl(18 13% 13% / 0.35);
		}

		& td {
			padding: 0;
			border-bottom: none;
		}
	}

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		thead {
			display: table-header-group;
		}

		tbody {
			& tr {
				position: static;
				display: table-row;
				flex-wrap: unset;
				align-items: unset;
				height: 4rem;
				gap: unset;
				padding: unset;
				border-top: none;
			}

			& td {
				display: table-cell;
				overflow: hidden;
				height: 4rem;
				padding-top: 0;
				padding-bottom: 0;
				padding-left: 1rem;
				padding-right: 1rem;
				vertical-align: middle;
				border-bottom: 1px solid ${theme.palette.primary.main};
			}
		}
	}
`;

export const levelBadgeBaseStyle = css`
	letter-spacing: 0.06em;
	text-transform: uppercase;
`;

export const levelErrorStyle = css`
	color: ${theme.palette.error.main};
`;

export const levelWarnStyle = css`
	color: ${theme.palette.warning.main};
`;

export const dateCellStyle = css`
	flex-basis: 100%;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;

	span {
		color: hsl(0, 0%, 45%);
	}
`;

export const messageCellStyle = css`
	flex-basis: 100%;

	& span {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		text-align: left;
		color: ${theme.palette.text.secondary};
	}
`;

export const actionCellStyle = css`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	display: flex;

	& button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25em;

		svg {
			width: 1.25em;
			height: 1.25em;
			fill: ${theme.palette.text.secondary};
		}
	}

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		position: static;
	}
`;
