import { css, keyframes } from '@emotion/css';
import { BREAKPOINTS } from '@Theme/theme';

const fireAnimation = keyframes`
  0%   { opacity: 0.47; width: 95px;  height: 95px;  }
  10%  { opacity: 0.60; width: 105px; height: 105px; }
  20%  { opacity: 0.52; width: 98px;  height: 98px;  }
  30%  { opacity: 0.62; width: 106px; height: 106px; }
  40%  { opacity: 0.55; width: 100px; height: 100px; }
  50%  { opacity: 0.64; width: 108px; height: 108px; }
  60%  { opacity: 0.54; width: 99px;  height: 99px;  }
  70%  { opacity: 0.61; width: 105px; height: 105px; }
  80%  { opacity: 0.57; width: 102px; height: 102px; }
  90%  { opacity: 0.63; width: 107px; height: 107px; }
  100% { opacity: 0.47; width: 95px;  height: 95px;  }
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
