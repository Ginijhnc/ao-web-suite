import { css } from '@emotion/css';
import theme, { BREAKPOINTS } from '@Theme/theme';

export const sectionStyle = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.5rem;

	@media (min-width: ${BREAKPOINTS.sm}em) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: ${BREAKPOINTS.lg}em) {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export const cardStyle = css`
	position: relative;
	border-radius: 1em;
	overflow: hidden;
	min-height: 15rem;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;

export const cardImageStyle = css`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: 0;
`;

export const overlayStyle = css`
	position: absolute;
	inset: 0;
	background: linear-gradient(
		to top,
		hsl(0, 0%, 0%, 0.85) 0%,
		hsl(0, 0%, 0%, 0) 100%
	);
	z-index: 1;
	transition: opacity 0.2s ease;
	opacity: 0.9;

	article:hover & {
		opacity: 1;
	}
`;

export const cardContentStyle = css`
	position: relative;
	z-index: 2;
	padding: 1.25em;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.4em;

	p {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: ${theme.palette.text.secondary};
	}
`;

export const arrowStyle = css`
	color: ${theme.palette.text.secondary};
	display: flex;
	align-items: center;

	svg {
		width: 1.1em;
		height: 1.1em;
		fill: currentColor;
		transform: translateY(2px);
	}
`;

export const disabledCardStyle = css`
	opacity: 0.45;
	cursor: not-allowed;
`;
