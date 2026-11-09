import borderSquareTexture from '@Assets/images/textures/border_square.png';
import brownBackgroundTexture from '@Assets/images/textures/brown_background_texture.png';
import { css } from '@emotion/css';
import theme, { BREAKPOINTS } from '@Theme/theme';
import type { DialogSize } from './Dialog.types';

export const dialogOverlayStyle = css`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 1rem;
`;

export const dialogBaseStyle = css`
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	max-height: 45rem;
	padding: 2.5em 1.5em 1.5em 1.5em;
	background-color: ${theme.palette.primary.main};
	background-image:
		url(${brownBackgroundTexture}), url(${borderSquareTexture});
	background-repeat: repeat, round;
	background-size: cover, contain;
	border: 8px solid transparent;
	border-image: url(${borderSquareTexture}) 10 fill;
	border-image-slice: 10;
	border-image-repeat: stretch;
	box-shadow: 0 0 24px hsl(0, 0%, 0%, 75%);

	@media (min-width: ${BREAKPOINTS.sm}em) {
		padding: 2.5em 3em 2em 3em;
	}
`;

export const dialogSizeStyles = {
	sm: css`
		@media (min-width: ${BREAKPOINTS.sm}em) {
			max-width: 26rem;
		}
	`,
	md: css`
		@media (min-width: ${BREAKPOINTS.sm}em) {
			max-width: 34rem;
		}
	`,
	lg: css`
		@media (min-width: ${BREAKPOINTS.sm}em) {
			max-width: 40rem;
		}
	`,
	xl: css`
		@media (min-width: ${BREAKPOINTS.sm}em) {
			max-width: 48rem;
		}
	`,
	'2xl': css`
		@media (min-width: ${BREAKPOINTS.sm}em) {
			max-width: 55rem;
		}
	`,
} satisfies Record<DialogSize, string>;

export const dialogHeaderStyle = css`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 1.375em;

	p {
		color: ${theme.palette.text.primary};
	}
`;

export const dialogIconStyle = css`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 0.35em;

	svg {
		width: 2.5em;
		height: 2.5em;
		fill: ${theme.palette.text.secondary};
	}
`;

export const dialogBodyStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	text-align: center;
`;

export const dialogFooterStyle = css`
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 1rem;
	margin-top: 2.625em;
`;

export const dialogDividerStyle = css`
	border: none;
	border-top: 1px solid ${theme.palette.divider};
	margin: 0 0 1.5rem;
`;

export const dialogCloseButtonStyle = css`
	position: absolute;
	top: 15px;
	right: 15px;
	background: transparent;
	border: none;
	padding: 0.25em;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.25em;
	transition: background-color 0.15s;

	svg {
		width: 1.25em;
		height: 1.25em;
		fill: ${theme.palette.text.secondary};
	}

	&:hover {
		background-color: hsl(0, 0%, 100%, 8%);

		svg {
			fill: ${theme.palette.text.primary};
		}
	}

	&:active {
		background-color: hsl(0, 0%, 100%, 5%);
	}
`;
