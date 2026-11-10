import { ArrowForwardIcon } from './ArrowForwardIcon';
import { CancelIcon } from './CancelIcon';
import { CheckIcon } from './CheckIcon';
import { ChevronLeftIcon } from './ChevronLeftIcon';
import { ChevronRightIcon } from './ChevronRightIcon';
import { CloseIcon } from './CloseIcon';
import { CloudDoneIcon } from './CloudDoneIcon';
import { CloudUploadIcon } from './CloudUploadIcon';
import { CodeIcon } from './CodeIcon';
import { CopyIcon } from './CopyIcon';
import { DatsIcon } from './DatsIcon';
import { ErrorFilledIcon } from './ErrorFilledIcon';
import { ErrorOutlineIcon } from './ErrorOutlineIcon';
import { EyeIcon } from './EyeIcon';
import { HomeIcon } from './HomeIcon';
import { ImageIcon } from './ImageIcon';
import { IndexingDataIcon } from './IndexingDataIcon';
import { InfoIcon } from './InfoIcon';
import { MapeadorIcon } from './MapeadorIcon';
import { MenuIcon } from './MenuIcon';
import { MoreHorizIcon } from './MoreHorizIcon';
import { PanelIcon } from './PanelIcon';
import { SearchIcon } from './SearchIcon';
import { SearchOffIcon } from './SearchOffIcon';
import { SettingsIcon } from './SettingsIcon';
import { TrashIcon } from './TrashIcon';
import { TutorialIcon } from './TutorialIcon';
import { UploadIcon } from './UploadIcon';
import { WarningIcon } from './WarningIcon';

// Named exports for direct imports when the icon is statically known.
export {
	ArrowForwardIcon,
	CancelIcon,
	CheckIcon,
	ChevronLeftIcon,
	CloudDoneIcon,
	CloudUploadIcon,
	ChevronRightIcon,
	CloseIcon,
	CodeIcon,
	CopyIcon,
	DatsIcon,
	ErrorFilledIcon,
	ErrorOutlineIcon,
	EyeIcon,
	HomeIcon,
	ImageIcon,
	IndexingDataIcon,
	InfoIcon,
	MapeadorIcon,
	MenuIcon,
	MoreHorizIcon,
	PanelIcon,
	SearchIcon,
	SearchOffIcon,
	SettingsIcon,
	TrashIcon,
	TutorialIcon,
	UploadIcon,
	WarningIcon,
};

// Map for dynamic lookup by IconName
export const icons = {
	ArrowForwardIcon,
	CancelIcon,
	CheckIcon,
	ChevronLeftIcon,
	CloudDoneIcon,
	CloudUploadIcon,
	ChevronRightIcon,
	CloseIcon,
	CodeIcon,
	CopyIcon,
	DatsIcon,
	ErrorFilledIcon,
	ErrorOutlineIcon,
	EyeIcon,
	HomeIcon,
	ImageIcon,
	IndexingDataIcon,
	InfoIcon,
	MapeadorIcon,
	MenuIcon,
	MoreHorizIcon,
	PanelIcon,
	SearchIcon,
	SearchOffIcon,
	SettingsIcon,
	TrashIcon,
	TutorialIcon,
	UploadIcon,
	WarningIcon,
};

export type IconProps = React.SVGProps<SVGSVGElement>;

export type IconName = keyof typeof icons;
