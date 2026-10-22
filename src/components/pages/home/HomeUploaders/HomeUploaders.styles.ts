import { css } from '@emotion/css';

export const uploadersContainerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	padding: 2.5em 2em 3em 2em;
	background-color: hsl(25, 20%, 12%, 20%);
	border-radius: 1em;
	margin-top: 1.5rem;
	width: 100%;
	max-width: 60rem;
`;

export const fileSelectorGroupStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
`;

export const chipsRowStyle = css`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	justify-content: center;
`;

export const actionsRowStyle = css`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	justify-content: center;
	margin-top: 0.5rem;
`;
