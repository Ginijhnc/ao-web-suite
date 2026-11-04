import brownBackgroundTexture from '@Assets/images/textures/brown_background_texture.png';
import { css } from '@emotion/css';

export const dashboardStyle = css`
	position: relative;
	display: flex;
	min-height: 100vh;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url(${brownBackgroundTexture});
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment: fixed;
		z-index: 0;
		pointer-events: none;
	}
`;

export const mainStyle = css`
	position: relative;
	z-index: 1;
	flex: 1;
	min-width: 0;
`;
