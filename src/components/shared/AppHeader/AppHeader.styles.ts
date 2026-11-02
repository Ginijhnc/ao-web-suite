import { css, keyframes } from '@emotion/css';
import { BREAKPOINTS } from '@Theme/theme';

const fireAnimation = keyframes`
  0%   { opacity: 0.47; scale: 0.88; }
  10%  { opacity: 0.60; scale: 0.97; }
  20%  { opacity: 0.52; scale: 0.91; }
  30%  { opacity: 0.62; scale: 0.98; }
  40%  { opacity: 0.55; scale: 0.93; }
  50%  { opacity: 0.64; scale: 1.00; }
  60%  { opacity: 0.54; scale: 0.92; }
  70%  { opacity: 0.61; scale: 0.97; }
  80%  { opacity: 0.57; scale: 0.94; }
  90%  { opacity: 0.63; scale: 0.99; }
  100% { opacity: 0.47; scale: 0.88; }
`;

export const headerStyle = css`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const torchWrapperStyle = css`
	position: relative;
	width: 40px;
	height: 60px;
	margin: 20px 0px 0 0px;

	@media (min-width: ${BREAKPOINTS.md}em) {
		margin: 20px 45px 0 45px;
	}

	&::before {
		content: '';
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		width: 6.75em;
		height: 6.75em;
		background: radial-gradient(
			circle,
			rgba(255, 165, 0, 0.8) 0%,
			rgba(255, 165, 0, 0) 65%
		);
		border-radius: 50%;
		filter: blur(60px);
		z-index: 1;
		animation: ${fireAnimation} 2.5s infinite ease-in-out;
	}
`;

export const torchImgStyle = css`
	width: 0.7em;
	height: auto;
	position: absolute;
	top: 17%;
	left: 50%;
	transform: translateX(-50%);
	z-index: 2;
`;
