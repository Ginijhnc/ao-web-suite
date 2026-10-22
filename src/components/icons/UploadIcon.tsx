import type { IconProps } from './index';

export const UploadIcon = (props: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="white"
			{...props}
		>
			<path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
		</svg>
	);
};
