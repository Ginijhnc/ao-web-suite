import borderTexture from '@Assets/images/textures/border.png';
import brownBackgroundTexture from '@Assets/images/textures/brown_background_texture.png';
import { css } from '@emotion/css';
import theme, { BREAKPOINTS } from '@Theme/theme';

export const sidebarStyle = css`
	width: 100vw;
	max-width: 100vw;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 4.5rem 0 1rem;
	background: ${theme.palette.secondary.main};
	transition: width 0.25s ease-in-out;
	overflow-y: auto;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url(${brownBackgroundTexture});
		background-repeat: repeat;
		background-size: auto;
		background-position: top left;
		background-attachment: fixed;
		z-index: 0;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 6px;
		background-image: url(${borderTexture});
		background-repeat: repeat-y;
		background-position: right top;
		background-size: 6px auto;
		z-index: 5;
	}

	& > * {
		position: relative;
		z-index: 2;
	}

	@media (min-width: ${BREAKPOINTS.lg}em) {
		width: 15rem;
		padding-top: 0.8rem;
	}
`;

export const sidebarNavItemStyle = css`
	@media (min-width: ${BREAKPOINTS.lg}em) {
		align-self: stretch;
	}
`;

export const sidebarNavItemCollapsedStyle = css`
	@media (min-width: ${BREAKPOINTS.lg}em) {
		width: 100%;
		justify-content: center;
		padding-left: 0;
		padding-right: 0;
	}
`;

export const sidebarCollapsedStyle = css`
	@media (min-width: ${BREAKPOINTS.lg}em) {
		&&& {
			width: 4.5rem;
		}

		svg {
			margin: 0;
		}
	}
`;

export const sidebarLinksStyle = css`
	display: flex;
	flex-direction: column;
	gap: 0;

	@media (min-width: ${BREAKPOINTS.lg}em) {
		margin-top: 0.6rem;
		align-items: stretch;
	}
`;

export const sidebarLinksCollapsedStyle = css`
	@media (min-width: ${BREAKPOINTS.lg}em) {
		align-items: center;
	}
`;

export const linkStyle = css`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0.75em 1.3rem;
	border-radius: 0;
	border: none;
	background: transparent;
	color: ${theme.palette.text.primary};
	text-decoration: none;
	cursor: pointer;
	width: 100%;
	text-align: left;

	&:hover {
		background: hsl(0, 0%, 100%, 0.06);
	}
`;

export const linkContentStyle = css`
	display: flex;
	align-items: center;
	gap: 1.35rem;
	width: 100%;
`;

export const linkIconStyle = css`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 1.5em;

	svg {
		width: 1.5em;
		height: 1.5em;
		fill: ${theme.palette.text.secondary};
	}
`;

export const linkTextStyle = css`
	display: inline-block;
	text-align: left;
	color: ${theme.palette.text.secondary};
`;

export const linkActiveStyle = css`
	&& {
		background: hsl(0, 0%, 100%, 0.1);
		color: ${theme.palette.text.primary};

		span {
			color: ${theme.palette.text.primary};
		}

		svg {
			fill: ${theme.palette.text.primary};
		}
	}
`;

export const collapseButtonStyle = css`
	display: none;
	border: none;
	background: transparent;
	color: ${theme.palette.text.primary};
	cursor: pointer;
	margin-left: auto;
	padding-right: 0.4rem;
	padding-left: 0.75em;
	transform: translateX(-1.1em);

	@media (min-width: ${BREAKPOINTS.lg}em) {
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 1.8em;
			height: 1.8em;
			fill: ${theme.palette.text.secondary};
		}
	}
`;

export const mobileDrawerToggleStyle = css`
	position: fixed;
	top: 0;
	right: 0;
	z-index: 1201;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.75em;
	height: 2.75em;
	border: none;
	border-radius: 0.4em;
	background-color: hsl(14, 22%, 9%);
	border: 2px solid hsl(12, 17%, 12%);
	cursor: pointer;

	@media (min-width: ${BREAKPOINTS.lg}em) {
		display: none;
	}
`;
