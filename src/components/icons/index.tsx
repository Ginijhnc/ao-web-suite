import { DatsIcon } from './DatsIcon';
import { ImageIcon } from './ImageIcon';
import { IndexingDataIcon } from './IndexingDataIcon';
import { TrashIcon } from './TrashIcon';
import { UploadIcon } from './UploadIcon';
import { WarningIcon } from './WarningIcon';

// Named exports for direct imports when the icon is statically known.
export {
	DatsIcon,
	ImageIcon,
	IndexingDataIcon,
	TrashIcon,
	UploadIcon,
	WarningIcon,
};

// Map for dynamic lookup by IconName
export const icons = {
	DatsIcon,
	ImageIcon,
	IndexingDataIcon,
	TrashIcon,
	UploadIcon,
	WarningIcon,
};

export type IconProps = React.SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;
