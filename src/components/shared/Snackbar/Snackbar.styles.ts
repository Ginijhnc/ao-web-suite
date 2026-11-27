import { toastBaseStyle } from '@Components/shared/ToastContainer/ToastContainer.styles';
import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const snackbarStyle = css`
	${toastBaseStyle};
	display: flex;
	align-items: center;
	gap: 0.75em;
	max-width: 28rem;
	padding: 0.5em 1em 0.7em 1em;
	view-transition-name: snackbar;
	view-transition-class: no-page-transition;
	background-color: ${theme.palette.background.default};
	color: ${theme.palette.text.primary};
	border: 1px solid ${theme.palette.neutral.main};

	// message
	& > span {
		white-space: nowrap;
		line-height: 1;
	}

	body[data-fab-visible='true'] & {
		margin-bottom: 5.5rem;
	}
`;

export const snackbarActionStyle = css`
	background: none;
	border: none;
	margin-left: 2em;
	text-transform: uppercase;
	cursor: pointer;
	white-space: nowrap;

	& > span {
		color: ${theme.palette.warning.main};
	}
`;

export const snackbarCloseButtonStyle = css`
	background: none;
	border: none;
	color: inherit;
	opacity: 0.6;
	cursor: pointer;
	display: flex;
	align-items: center;
	padding: 0;

	&:hover {
		opacity: 1;
	}
`;
