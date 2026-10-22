import buttonPrimaryTexture from '@Assets/images/textures/button_primary_texture.png';
import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const baseButtonStyle = css`
	border-radius: 0.5em;
	border: 2px solid transparent;
	font-weight: 500;
	color: ${theme.palette.text.primary};
	transition: border-color 0.2s;
	text-transform: none;

	&.Mui-disabled {
		pointer-events: auto;
		cursor: not-allowed;
	}

	svg {
		fill: ${theme.palette.text.secondary};
		width: 1.05em;
		height: 1.05em;
	}
`;

export const mdSizeStyle = css`
	font-size: 1rem;
	padding: 0.5em 1em;
	min-height: 3em;
	min-width: 10rem;
`;

export const smSizeStyle = css`
	font-size: 0.875rem;
	padding: 0.375em 0.75em;
	min-height: 2.5em;
	min-width: 7rem;
`;

export const primaryButtonStyle = css`
	background-color: ${theme.palette.secondary.main};
	border-color: hsl(0, 3%, 10%);
	background-image: url(${buttonPrimaryTexture});
	background-size: cover;
	color: ${theme.palette.text.secondary};
	transition: filter 0.2s;

	&:hover {
		filter: brightness(130%) saturate(130%);
	}

	&:active {
		filter: brightness(85%) saturate(90%);
	}

	&:disabled {
		filter: brightness(75%) saturate(75%);
		color: hsl(40, 3%, 45%);

		svg {
			fill: hsl(40, 3%, 45%);
		}
	}
`;

export const secondaryButtonStyle = css`
	border-color: hsl(0, 5%, 25%);
	color: ${theme.palette.text.secondary};
	transition:
		border-color 0.2s,
		background-color 0.2s;

	svg {
		fill: ${theme.palette.text.secondary};
	}

	&:hover {
		border-color: hsl(0, 5%, 40%);
		background-color: hsl(0, 5%, 12%);
	}

	&:active {
		background-color: hsl(0, 5%, 8%);
	}

	&:disabled {
		border-color: hsl(0, 3%, 15%);
		color: hsl(0, 3%, 30%);

		svg {
			fill: hsl(0, 3%, 30%);
		}
	}
`;
