import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const trackStyle = css`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	z-index: 1202;
	pointer-events: none;
`;

export const barStyle = css`
	height: 100%;
	z-index: 1202;
	background-color: color-mix(
		in srgb,
		${theme.palette.warning.main} 70%,
		transparent
	);
	transition:
		width 400ms ease,
		opacity 300ms ease;
	box-shadow: 0 0 8px
		color-mix(in srgb, ${theme.palette.warning.main} 50%, transparent);
`;
