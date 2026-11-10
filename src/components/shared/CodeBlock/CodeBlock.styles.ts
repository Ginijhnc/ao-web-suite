import { css } from '@emotion/css';
import theme, { BREAKPOINTS } from '@Theme/theme';

export const codeBlockWrapperStyle = css`
	position: relative;
	align-self: stretch;
`;

export const codeBlockPreStyle = css`
	background-color: hsl(18, 18%, 6%, 50%);
	border: 1px solid ${theme.palette.divider};
	border-radius: 0.4em;
	padding: 0.3em 4em 0.75em 0.75em;
	margin: 0;
	white-space: pre-wrap;
	overflow-wrap: break-word;
	overflow-y: auto;
	min-height: 13rem;
	max-height: 20rem;
	line-height: 1.3;
	text-align: left
	color: ${theme.palette.text.primary};
`;

export const scrollHintStyle = (visible: boolean) => {
	return css`
		position: absolute;
		bottom: 0;
		left: 0;
		right: 1em;
		height: 1.2rem;
		background: linear-gradient(
			to top,
			hsl(18, 12%, 20%, 90%) 0%,
			hsl(18, 12%, 20%, 60%) 30%,
			hsl(18, 12%, 20%, 25%) 60%,
			hsl(18, 12%, 20%, 5%) 85%,
			transparent 100%
		);
		border-radius: 1em 1em 0.3em 0.3em;
		pointer-events: none;
		opacity: ${visible ? 0.3 : 0};
		transition: opacity 0.4s ease;
	`;
};

export const copyButtonStyle = (isScrollable: boolean) => {
	return css`
		position: absolute;
		top: 0.4em;
		right: ${isScrollable ? '0.5em' : '0.3em'};
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
			width: 1.1em;
			height: 1.1em;
			fill: ${theme.palette.text.secondary};
		}

		&:hover {
			background-color: hsl(0, 0%, 100%, 8%);

			svg {
				fill: ${theme.palette.text.primary};
			}
		}

		@media (min-width: ${BREAKPOINTS.sm}em) {
			right: ${isScrollable ? '1.3em' : '0.3em'};
		}
	`;
};
