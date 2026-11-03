import type { IconProps } from './index';

export const ChevronRightIcon = (props: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="white"
			{...props}
		>
			<path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
		</svg>
	);
};
