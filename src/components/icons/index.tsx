import { ImageIcon } from './ImageIcon';

// Named exports for direct imports when the icon is statically known.
export { ImageIcon };

// Map for dynamic lookup by IconName
export const icons = {
	ImageIcon,
};

export type IconProps = React.SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;
