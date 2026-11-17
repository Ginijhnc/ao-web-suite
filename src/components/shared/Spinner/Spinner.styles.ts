import { css, keyframes } from '@emotion/css';

const spin = keyframes`
	to { transform: rotate(360deg); }
`;

export const makeSpinnerStyle = (size: number, color: string): string => {
	return css`
		width: ${size}em;
		height: ${size}em;
		border: ${size * 0.12}em solid
			color-mix(in srgb, ${color} 25%, transparent);
		border-top-color: ${color};
		border-radius: 50%;
		animation: ${spin} 0.8s linear infinite;
		display: inline-block;
		flex-shrink: 0;
	`;
};
