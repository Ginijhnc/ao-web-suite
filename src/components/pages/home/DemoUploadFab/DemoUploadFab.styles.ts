import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const fabStyle = css`
	position: fixed;
	bottom: 1.5rem;
	left: 1.5rem;
	view-transition-name: demo-upload-fab;
	width: 3.5rem;
	height: 3.5rem;
	border-radius: 50%;
	border: 2px solid ${theme.palette.neutral.main};
	background-color: ${theme.palette.secondary.main};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 10;
	transition: filter 0.2s;

	@media (min-width: ${theme.breakpoints.values.sm}em) {
		left: unset;
		right: 1.5rem;
	}

	svg {
		fill: ${theme.palette.text.secondary};
		width: 1.4em;
		height: 1.4em;
	}

	&:not(:disabled):hover {
		filter: brightness(140%) saturate(130%);
	}

	&:not(:disabled):active {
		filter: brightness(85%);
	}

	&:disabled {
		cursor: not-allowed;
	}
`;
