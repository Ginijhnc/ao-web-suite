import { css } from '@emotion/css';

export const toastBaseStyle = css`
	font-size: 0.9rem;
	font-weight: 600;
	border-radius: 0.4em;
	padding: 0.6em 1em;
	box-shadow: 0 0.25rem 0.75rem hsl(0, 0%, 0%, 0.3);
	max-width: 22rem;

	& > div:last-child {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
`;

export const successToastStyle = css`
	background-color: hsl(145, 45%, 25%, 0.78) !important;
	color: hsl(145, 70%, 90%) !important;
	border: 1px solid hsl(145, 55%, 48%, 0.55);
`;

export const warningToastStyle = css`
	background-color: hsl(36, 60%, 25%, 0.78) !important;
	color: hsl(36, 100%, 90%) !important;
	border: 1px solid hsl(36, 75%, 52%, 0.55);
`;

export const errorToastStyle = css`
	background-color: hsl(357, 50%, 25%, 0.78) !important;
	color: hsl(357, 80%, 90%) !important;
	border: 1px solid hsl(357, 65%, 52%, 0.55);
`;

export const warningIconContainerStyle = css`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5em;
	height: 1.5em;
	border-radius: 50%;
	background-color: hsl(36, 99%, 62%);
	flex-shrink: 0;

	svg {
		width: 0.85em;
		height: 0.85em;
		margin-bottom: 0.1em;
	}
`;
