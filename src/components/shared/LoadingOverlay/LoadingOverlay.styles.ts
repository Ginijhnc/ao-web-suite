import { css, keyframes } from '@emotion/css';
import { BREAKPOINTS } from '@Theme/theme';

const l1 = keyframes`
	to { clip-path: inset(0 -34% 0 0); }
`;

export const overlayStyle = css`
	position: fixed;
	inset: 0;
	width: 100dvw;
	height: 100dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: hsl(0, 0%, 0%, 0.7);
	z-index: 10;

	& > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 4rem;
	}

	// gif de casper
	img {
		width: 2.5rem;
	}

	& > div > div {
		display: flex;
		align-items: center;
		gap: 0.25em;
	}
`;

export const loaderStyle = css`
	width: 1em;
	aspect-ratio: 4;
	margin-bottom: -0.6em;

	@media (min-width: ${BREAKPOINTS.md}em) {
		margin-bottom: -1em;
	}

	background: radial-gradient(
			circle closest-side,
			hsl(0, 0%, 100%) 90%,
			hsl(0, 0%, 0%, 0%)
		)
		0 / calc(100% / 3) 100% space;
	clip-path: inset(0 100% 0 0);
	animation: ${l1} 1s steps(4) infinite;
`;
